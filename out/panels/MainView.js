"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainView = void 0;
const vscode = require("vscode");
const execute_shell_1 = require("../utilities/execute-shell");
const get_uri_1 = require("../utilities/get-uri");
const resim_commands_1 = require("../resim-commands");
const ramda_1 = require("ramda");
const address_type_1 = require("../utilities/address-type");
const actions_1 = require("../utilities/actions");
const find_files_1 = require("../utilities/find-files");
class MainView {
    constructor(_extensionUri, accounts, context) {
        this._extensionUri = _extensionUri;
        this.accounts = accounts;
        this.files = [];
        this.context = context;
        this.loadDataFromLedger();
        const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
        // vscode.workspace.createFileSystemWatcher('**/*.rs', false, false, false).onDidChange(async () => {
        //await this.updateBadges()
        //})
        this.files = (0, find_files_1.findAllRustFiles)(root);
        console.log(this.files);
    }
    addAccountToView(address) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const storedKeypair = this.context.globalState.get(address);
            this.accounts.addAccount(Object.assign(Object.assign({ address }, yield (0, actions_1.exec_showAccount)(address)), { privateKey: (_a = storedKeypair === null || storedKeypair === void 0 ? void 0 : storedKeypair.privateKey) !== null && _a !== void 0 ? _a : '<unavailable>', publicKey: (_b = storedKeypair === null || storedKeypair === void 0 ? void 0 : storedKeypair.publicKey) !== null && _b !== void 0 ? _b : '<unavailable>' }));
        });
    }
    loadDataFromLedger() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearData();
            const ledger = yield (0, actions_1.exec_showLedger)();
            for (const component of ledger.components) {
                yield ({
                    'account': () => this.addAccountToView(component),
                    'contract': () => { },
                    'package': () => { },
                    'transaction': () => { },
                    'component': () => { },
                    'resource': () => { },
                })[(0, address_type_1.getAddressType)(component)]();
            }
        });
    }
    clearData() {
        this.accounts.clear();
    }
    createAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield (0, actions_1.exec_createAccount)();
            this.context.globalState.update(account.address, { publicKey: account.publicKey, privateKey: account.privateKey });
            this.addAccountToView(account.address);
        });
    }
    createBadge() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ramda_1.pipe)(resim_commands_1.newSimpleBadge, execute_shell_1.execShell)();
        });
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            switch (message.type) {
                case 'create-account':
                    this.createAccount();
                    return;
                case 'create-badge':
                    this.createBadge();
                    return;
            }
        }));
    }
    _getHtmlForWebview(webview) {
        // The CSS file from the Svelte build output
        const stylesUri = (0, get_uri_1.getUri)(webview, this._extensionUri, ["webview-ui", "public", "build", "bundle.css"]);
        // The JS file from the Svelte build output
        const scriptUri = (0, get_uri_1.getUri)(webview, this._extensionUri, ["webview-ui", "public", "build", "bundle.js"]);
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
exports.MainView = MainView;
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=MainView.js.map