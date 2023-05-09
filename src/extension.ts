import * as vscode from "vscode"
import { AccountsTreeView } from "./panels/AccountsTreeView";
import { MainView } from "./panels/MainView"
import { PackagesTreeView } from "./panels/PackagesTreeView";
import { store as _store } from './persistent-state'

export const projectRoot = vscode.workspace.workspaceFolders![0].uri.path

export function activate(context: vscode.ExtensionContext) {
  const store = _store(context.globalState)

  const accountsTreeViewProvider = new AccountsTreeView(store)
  const packagesTreeViewProvider = new PackagesTreeView('src')
  const mainViewProvider = new MainView(context.extensionUri, accountsTreeViewProvider, packagesTreeViewProvider, store, 'src')

  /*
  vscode.commands.registerCommand(
    "publishPackage",
    () => exec_publishPackage(vscode.workspace.workspaceFolders![0].uri.path).then(({ packageAddress }) => {
      projectTreeViewProvider.addPackage(packageAddress)
    })
  )
*/
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('main', mainViewProvider, { webviewOptions: { retainContextWhenHidden: true } }))
  context.subscriptions.push(vscode.window.registerTreeDataProvider('accounts', accountsTreeViewProvider))
  context.subscriptions.push(vscode.window.registerTreeDataProvider('packages', packagesTreeViewProvider))
}