import * as vscode from 'vscode';
import { AccountT } from '../types';
import { store as _store } from '../persistent-state'
import { exec_showAccount } from '../utilities/actions';

type Element = Account | PublicKey | PrivateKey | PublicKeyValue | PrivateKeyValue | Resources | Resource | ResourceName | ResourceAmount | ResourceSymbol | ResourceNonFungibles | ResourceNonFungibleId

export class AccountsTreeView implements vscode.TreeDataProvider<Element> {
  private accounts: AccountT[] = []

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>()
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event

  constructor(
    private readonly store: ReturnType<typeof _store>,
  ) { }

  public clear() {
    this.accounts = []
    this.refresh()
  }

  public refresh(element?: vscode.TreeItem): any {
    this._onDidChangeTreeData.fire(element);
  }

  public async addAccount(address: string) {
    if (this.accounts.find(account => account.address === address)) return

    const storedKeypair = this.store.account.get(address)

    this.accounts.push(
      {
        address,
        ...await exec_showAccount(address),
        privateKey: storedKeypair?.privateKey ?? '<unavailable>',
        publicKey: storedKeypair?.publicKey ?? '<unavailable>'
      }
    )
    console.log(this.accounts)
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
          new Resources(element.account.resources),
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
      if (element instanceof Resources) {
        return Promise.resolve(
          element.resources.map(resource => new Resource(resource))
        )
      }
      if (element instanceof Resource) {
        let items: Element[] = []

        if (element.resource.name) items.push(new ResourceName(element.resource.name))
        if (element.resource.symbol) items.push(new ResourceSymbol(element.resource.symbol))
        items.push(new ResourceAmount(element.resource.amount))
        if (element.resource.nonFungibles) items.push(new ResourceNonFungibles(element.resource.nonFungibles.map(nft => nft.id)))

        return Promise.resolve(items)
      }

      if (element instanceof ResourceNonFungibles) {
        return Promise.resolve(element.nonFungibles.map(id => new ResourceNonFungibleId(id)))
      }


    } else {
      for (let account of this.accounts) {
        items.push(new Account(account))
      }
    }

    return Promise.resolve(items)
  }
}

export class Account extends vscode.TreeItem {
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

class Resources extends vscode.TreeItem {
  constructor(
    public readonly resources: AccountT['resources']
  ) {
    super(`resources`, vscode.TreeItemCollapsibleState.Collapsed)
  }
}

class Resource extends vscode.TreeItem {
  contextValue = 'resource'

  constructor(
    public readonly resource: AccountT['resources'][number]
  ) {
    super(`${resource.resourceAddress}`, vscode.TreeItemCollapsibleState.Collapsed)
  }
}

class ResourceName extends vscode.TreeItem {
  constructor(
    public readonly name: string
  ) {
    super(`name: ${name}`, vscode.TreeItemCollapsibleState.None)
  }
}

class ResourceAmount extends vscode.TreeItem {
  constructor(
    public readonly amount: string
  ) {
    super(`amount: ${amount}`, vscode.TreeItemCollapsibleState.None)
  }
}

class ResourceSymbol extends vscode.TreeItem {
  constructor(
    public readonly symbol: string
  ) {
    super(`symbol: ${symbol}`, vscode.TreeItemCollapsibleState.None)
  }
}

class ResourceNonFungibles extends vscode.TreeItem {
  constructor(
    public readonly nonFungibles: string[]
  ) {
    super(`NonFungibles`, vscode.TreeItemCollapsibleState.Collapsed)
  }
}

class ResourceNonFungibleId extends vscode.TreeItem {
  constructor(
    public readonly id: string
  ) {
    super(`${id}`, vscode.TreeItemCollapsibleState.None)
  }
}
/*
vscode.commands.registerCommand("setDefaultAccount", (account: Account) => {
  execShell(setDefaultAccount(account.account.address, account.account.privateKey))
})*/