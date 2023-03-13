import * as vscode from "vscode"
import { AccountsTreeView } from "./panels/AccountsTreeView";
import { MainView } from "./panels/MainView"
import { ProjectTreeView } from "./panels/ProjectTreeView";
import { exec_publishPackage } from "./utilities/actions";
import { store as _store } from './persistent-state'


export function activate(context: vscode.ExtensionContext) {
  const accountsTreeViewProvider = new AccountsTreeView()
  const projectTreeViewProvider = new ProjectTreeView('src')

  const store = _store(context.globalState)

  const mainViewProvider = new MainView(context.extensionUri, accountsTreeViewProvider, projectTreeViewProvider, store);

  vscode.commands.registerCommand(
    "publishPackage",
    () => exec_publishPackage(vscode.workspace.workspaceFolders![0].uri.path).then(({ packageAddress }) => {
      store.packageAddress.set(packageAddress)
      projectTreeViewProvider.addBlueprintsToView()
    })
  )

  context.subscriptions.push(vscode.window.registerWebviewViewProvider('main', mainViewProvider))
  context.subscriptions.push(vscode.window.registerTreeDataProvider('accounts', accountsTreeViewProvider))
  context.subscriptions.push(vscode.window.registerTreeDataProvider('project', projectTreeViewProvider))
}