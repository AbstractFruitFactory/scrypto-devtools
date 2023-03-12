import * as vscode from "vscode"
import { AccountsTreeView } from "./panels/AccountsTreeView";
import { MainView } from "./panels/MainView"


export function activate(context: vscode.ExtensionContext) {
  const accountsTreeViewProvider = new AccountsTreeView()
  const mainViewProvider = new MainView(context.extensionUri, accountsTreeViewProvider, context.globalState, 'src');

  context.subscriptions.push(vscode.window.registerWebviewViewProvider('main', mainViewProvider))
  context.subscriptions.push(vscode.window.registerTreeDataProvider('accounts', accountsTreeViewProvider))
}