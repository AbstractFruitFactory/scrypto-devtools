import * as vscode from "vscode"
import { MessageFromWebview } from "../messages";
import { execShell } from "../utilities/execute-shell";
import { getUri } from "../utilities/get-uri";
import { Account, AccountsTreeView } from "./AccountsTreeView";
import { newSimpleBadge, setDefaultAccount } from "../resim-commands";
import { pipe } from "ramda";
import { getComponentAddressType } from "../utilities/address-type";
import { exec_callFunction, exec_createAccount, exec_exportABI, exec_publishPackage, exec_showComponent, exec_showLedger } from "../utilities/actions";
import { store as _store } from '../persistent-state'
import { Package, PackagesTreeView } from "./PackagesTreeView";
import { projectRoot } from "../extension";
import { findAllRustFiles } from "../utilities/find-files";
import { getBlueprintName } from "../utilities/rust-file-parsing";
import * as fs from "fs"
import { ABI, BlueprintT, PackageT } from "../types";
import { instantiationFunctionName } from "../utilities/abi";

export class MainView implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private files: string[] = []

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly accounts: AccountsTreeView,
    private readonly project: PackagesTreeView,
    private readonly store: ReturnType<typeof _store>,
    srcFolderName: string,
  ) {
    this.loadDataFromLedger()
    this.files = findAllRustFiles(`${projectRoot}/${srcFolderName}`)

    // vscode.workspace.createFileSystemWatcher('**/*.rs', false, false, false).onDidChange(async () => {
    //await this.updateBadges()
    //})
  }

  private async loadDataFromLedger() {
    this.clearData()
    const ledger = await exec_showLedger()

    for (const _package of ledger.packages) {
      await this.project.addPackage(_package)
    }

    for (const component of ledger.components) {
      await ({
        'account': () => this.accounts.addAccount(component),
        'component': () => this.loadComponent(component),
        'resource': () => { },
      })[getComponentAddressType(component)]()
    }

    for (const _package of ledger.packages) {
      await this.project.addPackage(_package)
    }
  }

  private clearData() {
    this.accounts.clear()
  }

  private async createAccount() {
    const account = await exec_createAccount()
    this.store.account.set(account.address, { publicKey: account.publicKey, privateKey: account.privateKey })
    this.accounts.addAccount(account.address)
  }

  private async loadComponent(address: string) {
    const { blueprint } = await exec_showComponent(address)
    const abi = await exec_exportABI(blueprint.packageAddress, blueprint.name).then(JSON.parse) as ABI
    this._view?.webview.postMessage({ type: 'component-loaded', payload: { address, abi } })
  }

  private async publishPackage() {
    const { packageAddress } = await exec_publishPackage(projectRoot)

    const blueprints = (await Promise.all(
      this.files.map(async file => {
        const name = getBlueprintName(fs.readFileSync(file, 'utf8'))
        if (!name) return

        let abi: ABI

        try {
          abi = await exec_exportABI(packageAddress, name).then(JSON.parse) as ABI
        } catch {
          return
        }

        return { name, abi }
      })
    )).filter(blueprint => blueprint !== undefined) as BlueprintT[]

    if (blueprints.length === 0) return

    const _package = {
      address: packageAddress,
      blueprints,
    }

    this._view?.webview.postMessage({ type: 'package-published', payload: _package })
  }

  private async instantiateBlueprint(blueprint: BlueprintT) {
    exec_callFunction(blueprint.abi.package_address, blueprint.name, instantiationFunctionName(blueprint), [])
  }

  private async createBadge() {
    pipe(newSimpleBadge, execShell)()
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

    vscode.commands.registerCommand("setDefaultAccount", (account: Account) => {
      execShell(setDefaultAccount(account.account.address, account.account.privateKey))
    })

    vscode.commands.registerCommand("selectPackage", (_package: PackageT) => {
      this._view?.webview.postMessage({ type: 'package-selected', payload: _package })
    })

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message: MessageFromWebview) => {
      switch (message.type) {
        case 'create-account': this.createAccount(); return
        case 'create-badge': this.createBadge(); return
        case 'publish-package': this.publishPackage(); return
        case 'instantiate-blueprint': this.instantiateBlueprint(message.content.blueprint); return
      }
    })
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // The CSS file from the Svelte build output
    const stylesUri = getUri(webview, this._extensionUri, ["webview-ui", "public", "build", "bundle.css"]);
    // The JS file from the Svelte build output
    const scriptUri = getUri(webview, this._extensionUri, ["webview-ui", "public", "build", "bundle.js"]);
    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
			</head>
			<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}