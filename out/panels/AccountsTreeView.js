"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsTreeView = void 0;
const vscode = require("vscode");
const execute_shell_1 = require("../utilities/execute-shell");
const resim_commands_1 = require("../resim-commands");
class AccountsTreeView {
    constructor() {
        this.accounts = [];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    clear() {
        this.accounts = [];
        this.refresh();
    }
    refresh(element) {
        this._onDidChangeTreeData.fire(element);
    }
    addAccount(account) {
        this.accounts.push(account);
        this.refresh();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        let items = [];
        if (element) {
            if (element instanceof Account) {
                return Promise.resolve([
                    new PublicKey(element.account.publicKey),
                    new PrivateKey(element.account.privateKey),
                    new Blueprint(element.account.blueprint)
                ]);
            }
            if (element instanceof PublicKey) {
                return Promise.resolve([
                    new PublicKeyValue(element.pubKey),
                ]);
            }
            if (element instanceof PrivateKey) {
                return Promise.resolve([
                    new PrivateKeyValue(element.privKey),
                ]);
            }
            if (element instanceof Blueprint) {
                return Promise.resolve([
                    new BlueprintName(element.blueprint),
                    new PackageAddress(element.blueprint)
                ]);
            }
            if (element instanceof BlueprintName) {
                return Promise.resolve([
                    new BlueprintNameValue(element.blueprint.name)
                ]);
            }
            if (element instanceof PackageAddress) {
                return Promise.resolve([
                    new PackageAddressValue(element.blueprint.packageAddress)
                ]);
            }
        }
        else {
            for (let account of this.accounts) {
                items.push(new Account(account));
            }
        }
        return Promise.resolve(items);
    }
}
exports.AccountsTreeView = AccountsTreeView;
class Account extends vscode.TreeItem {
    constructor(account, collapsibleState = vscode.TreeItemCollapsibleState.Collapsed) {
        super(account.address, collapsibleState);
        this.account = account;
        this.collapsibleState = collapsibleState;
        this.contextValue = 'account';
    }
}
class PublicKey extends vscode.TreeItem {
    constructor(pubKey) {
        super(`public_key`, vscode.TreeItemCollapsibleState.Collapsed);
        this.pubKey = pubKey;
    }
}
class PublicKeyValue extends vscode.TreeItem {
    constructor(pubKey) {
        super(`${pubKey}`, vscode.TreeItemCollapsibleState.None);
        this.pubKey = pubKey;
        this.contextValue = 'public-key';
    }
}
class PrivateKey extends vscode.TreeItem {
    constructor(privKey) {
        super(`private_key`, vscode.TreeItemCollapsibleState.Collapsed);
        this.privKey = privKey;
    }
}
class PrivateKeyValue extends vscode.TreeItem {
    constructor(privKey) {
        super(`${privKey}`, vscode.TreeItemCollapsibleState.None);
        this.privKey = privKey;
        this.contextValue = 'private-key';
    }
}
class Blueprint extends vscode.TreeItem {
    constructor(blueprint) {
        super(`blueprint`, vscode.TreeItemCollapsibleState.Collapsed);
        this.blueprint = blueprint;
    }
}
class BlueprintName extends vscode.TreeItem {
    constructor(blueprint) {
        super(`name`, vscode.TreeItemCollapsibleState.Collapsed);
        this.blueprint = blueprint;
    }
}
class PackageAddress extends vscode.TreeItem {
    constructor(blueprint) {
        super(`package_address`, vscode.TreeItemCollapsibleState.Collapsed);
        this.blueprint = blueprint;
    }
}
class BlueprintNameValue extends vscode.TreeItem {
    constructor(name) {
        super(`${name}`, vscode.TreeItemCollapsibleState.None);
        this.name = name;
    }
}
class PackageAddressValue extends vscode.TreeItem {
    constructor(address) {
        super(`${address}`, vscode.TreeItemCollapsibleState.None);
        this.address = address;
    }
}
vscode.commands.registerCommand("setDefaultAccount", (account) => {
    (0, execute_shell_1.execShell)((0, resim_commands_1.setDefaultAccount)(account.account.address, account.account.privateKey));
});
//# sourceMappingURL=AccountsTreeView.js.map