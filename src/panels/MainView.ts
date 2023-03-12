import * as vscode from "vscode"
import { MessageFromWebview } from "../messages";
import { execShell } from "../utilities/execute-shell";
import { getUri } from "../utilities/get-uri";
import { AccountsTreeView } from "./AccountsTreeView";
import { newSimpleBadge } from "../resim-commands";
import { pipe } from "ramda";
import { getAddressType } from "../utilities/address-type";
import { exec_createAccount, exec_showAccount, exec_showLedger } from "../utilities/actions";
import { findAllRustFiles } from "../utilities/find-files";

export class MainView implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private context: vscode.ExtensionContext;
  private files: string[] = []

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly accounts: AccountsTreeView,
    context: vscode.ExtensionContext
  ) {
    this.context = context
    this.loadDataFromLedger()
    const root = vscode.workspace.workspaceFolders![0].uri.fsPath

    // vscode.workspace.createFileSystemWatcher('**/*.rs', false, false, false).onDidChange(async () => {
    //await this.updateBadges()
    //})

    this.files = findAllRustFiles(root)
    console.log(this.files)
  }

  private async addAccountToView(address: string) {
    const storedKeypair = this.context.globalState.get<{ publicKey: string, privateKey: string }>(address)

    this.accounts.addAccount(
      {
        address,
        ...await exec_showAccount(address),
        privateKey: storedKeypair?.privateKey ?? '<unavailable>',
        publicKey: storedKeypair?.publicKey ?? '<unavailable>'
      }
    )
  }

  private async loadDataFromLedger() {
    this.clearData()
    const ledger = await exec_showLedger()

    for (const component of ledger.components) {
      await ({
        'account': () => this.addAccountToView(component),
        'contract': () => { },
        'package': () => { },
        'transaction': () => { },
        'component': () => { },
        'resource': () => { },
      })[getAddressType(component)]()
    }
  }

  private clearData() {
    this.accounts.clear()
  }

  private async createAccount() {
    const account = await exec_createAccount()
    this.context.globalState.update(account.address, { publicKey: account.publicKey, privateKey: account.privateKey })
    this.addAccountToView(account.address)
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

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message: MessageFromWebview) => {
      switch (message.type) {
        case 'create-account': this.createAccount(); return
        case 'create-badge': this.createBadge(); return
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