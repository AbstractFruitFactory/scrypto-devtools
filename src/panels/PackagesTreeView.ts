import * as vscode from 'vscode'
import { findAllRustFiles } from '../utilities/find-files'
import { getBlueprintName } from '../utilities/rust-file-parsing'
import * as fs from "fs"
import { ABI, BlueprintT, PackageT } from '../types'
import { exec_exportABI } from '../utilities/actions'
import { store as _store } from '../persistent-state'

type Element = Package | Blueprint | Function

export class PackagesTreeView implements vscode.TreeDataProvider<Element> {
    public packages: PackageT[] = []
    private files: string[] = []

    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>()
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event

    constructor(
        srcFolderName: string,
        private readonly projectRoot = vscode.workspace.workspaceFolders![0].uri.path
    ) {
        this.files = findAllRustFiles(`${this.projectRoot}/${srcFolderName}`)
    }

    public async addPackage(address: string) {
        if (this.packages.find(_package => _package.address === address)) return

        const blueprints = (await Promise.all(
            this.files.map(async file => {
                const name = getBlueprintName(fs.readFileSync(file, 'utf8'))
                if (!name) return

                let abi: ABI

                try {
                    abi = await exec_exportABI(address, name).then(JSON.parse) as ABI
                } catch {
                    return
                }

                return { name, abi }
            })
        )).filter(blueprint => blueprint !== undefined) as BlueprintT[]

        if (blueprints.length === 0) return

        this.packages.push({
            address,
            blueprints
        })

        this.refresh()
    }

    public clear() {
        this.packages = []
        this.refresh()
    }

    public refresh(element?: vscode.TreeItem): any {
        this._onDidChangeTreeData.fire(element);
    }

    getTreeItem(element: Blueprint): vscode.TreeItem {
        return element
    }

    getChildren(element?: Element): Thenable<Element[]> {
        let items: Package[] = []

        /*
        if (element) {
            if (element instanceof Package) {
                return Promise.resolve(element._package.blueprints.map(blueprint => new Blueprint(blueprint)))
            }
            if (element instanceof Blueprint) {
                return Promise.resolve(element.blueprint.abi.abi.fns.map(fn => new Function(fn.ident)))
            }
        } else {
            */

        if (!element) {
            for (let _package of this.packages) {
                items.push(new Package(_package))
            }
        }

        return Promise.resolve(items)
    }
}

export class Package extends vscode.TreeItem {
    contextValue = 'package'

    command = {
        title: 'Select Package',
        command: 'selectPackage',
        arguments: [this._package]
    }

    constructor(
        public readonly _package: PackageT,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(_package.address, collapsibleState)
    }
}

class Blueprint extends vscode.TreeItem {
    contextValue = 'blueprint'

    constructor(
        public readonly blueprint: BlueprintT,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    ) {
        super(blueprint.name, collapsibleState)
    }
}

class Function extends vscode.TreeItem {
    contextValue = 'function'

    constructor(
        public readonly name: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(name, collapsibleState)
    }
}