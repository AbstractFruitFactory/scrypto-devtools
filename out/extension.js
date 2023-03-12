"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const AccountsTreeView_1 = require("./panels/AccountsTreeView");
const MainView_1 = require("./panels/MainView");
function activate(context) {
    const accountsTreeViewProvider = new AccountsTreeView_1.AccountsTreeView();
    const mainViewProvider = new MainView_1.MainView(context.extensionUri, accountsTreeViewProvider, context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('main', mainViewProvider));
    context.subscriptions.push(vscode.window.registerTreeDataProvider('accounts', accountsTreeViewProvider));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map