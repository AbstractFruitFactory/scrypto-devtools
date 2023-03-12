import * as vscode from 'vscode';
import * as path from 'path';
import { execShell } from '../utilities/execute-shell';
import { setDefaultAccount } from '../resim-commands';
import { AccountT, BlueprintT } from '../types';

type Element = Account | PublicKey | PrivateKey | PublicKeyValue | PrivateKeyValue | Blueprint | BlueprintNameValue | PackageAddressValue

export class AccountsTreeView implements vscode.TreeDataProvider<Element> {
  private accounts: AccountT[] = []

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>()
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event

  constructor() { }

  public clear() {
    this.accounts = []
    this.refresh()
  }

  public refresh(element?: vscode.TreeItem): any {
    this._onDidChangeTreeData.fire(element);
  }

  public addAccount(account: AccountT) {
    this.accounts.push(account)
    this.refresh()
  }

  getTreeItem(element: Account): vscode.TreeItem {
    return element
  }

  getChildren(element?: Element): Thenable<Element[]> {
    let items: Account[] = []

    if (element) {
      if (element instanceof Account) {
        return Promise.resolve([
          new PublicKey(element.account.publicKey),
          new PrivateKey(element.account.privateKey),
          new Blueprint(element.account.blueprint)
        ])
      }
      if (element instanceof PublicKey) {
        return Promise.resolve([
          new PublicKeyValue(element.pubKey),
        ])
      }
      if (element instanceof PrivateKey) {
        return Promise.resolve([
          new PrivateKeyValue(element.privKey),
        ])
      }
      if (element instanceof Blueprint) {
        return Promise.resolve([
          new BlueprintName(element.blueprint),
          new PackageAddress(element.blueprint)
        ])
      }
      if (element instanceof BlueprintName) {
        return Promise.resolve([
          new BlueprintNameValue(element.blueprint.name)
        ])
      }
      if (element instanceof PackageAddress) {
        return Promise.resolve([
          new PackageAddressValue(element.blueprint.packageAddress)
        ])
      }
    } else {
      for (let account of this.accounts) {
        items.push(new Account(account))
      }
    }

    return Promise.resolve(items)
  }
}

class Account extends vscode.TreeItem {
  contextValue = 'account'

  constructor(
    public readonly account: AccountT,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
  ) {
    super(account.address, collapsibleState)
  }
}

class PublicKey extends vscode.TreeItem {
  constructor(
    public readonly pubKey: string
  ) {
    super(`public_key`, vscode.TreeItemCollapsibleState.Collapsed)
  }
}

class PublicKeyValue extends vscode.TreeItem {
  contextValue = 'public-key'

  constructor(
    public readonly pubKey: string
  ) {
    super(`${pubKey}`, vscode.TreeItemCollapsibleState.None)
  }
}

class PrivateKey extends vscode.TreeItem {
  constructor(
    public readonly privKey: string
  ) {
    super(`private_key`, vscode.TreeItemCollapsibleState.Collapsed)
  }
}

class PrivateKeyValue extends vscode.TreeItem {
  contextValue = 'private-key'

  constructor(
    public readonly privKey: string
  ) {
    super(`${privKey}`, vscode.TreeItemCollapsibleState.None)
  }
}

class Blueprint extends vscode.TreeItem {
  constructor(
    public readonly blueprint: BlueprintT
  ) {
    super(`blueprint`, vscode.TreeItemCollapsibleState.Collapsed)
  }
}

class BlueprintName extends vscode.TreeItem {
  constructor(
    public readonly blueprint: BlueprintT
  ) {
    super(`name`, vscode.TreeItemCollapsibleState.Collapsed);
  }
}

class PackageAddress extends vscode.TreeItem {
  constructor(
    public readonly blueprint: BlueprintT
  ) {
    super(`package_address`, vscode.TreeItemCollapsibleState.Collapsed);
  }
}

class BlueprintNameValue extends vscode.TreeItem {
  constructor(
    public readonly name: string
  ) {
    super(`${name}`, vscode.TreeItemCollapsibleState.None);
  }
}

class PackageAddressValue extends vscode.TreeItem {
  constructor(
    public readonly address: string
  ) {
    super(`${address}`, vscode.TreeItemCollapsibleState.None);
  }
}

vscode.commands.registerCommand("setDefaultAccount", (account: Account) => {
  execShell(setDefaultAccount(account.account.address, account.account.privateKey))
})