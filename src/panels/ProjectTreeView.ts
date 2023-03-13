import * as vscode from 'vscode'
import { exec_publishPackage } from '../utilities/actions'
import { findAllRustFiles } from '../utilities/find-files'
import { getBlueprintName } from '../utilities/rust-file-parsing'
import * as fs from "fs"

type Element = Blueprint

export class ProjectTreeView implements vscode.TreeDataProvider<Element> {
    private blueprints: string[] = []
    private files: string[] = []

    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>()
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event

    constructor(
        srcFolderName: string,
        private readonly projectRoot = vscode.workspace.workspaceFolders![0].uri.path
    ) {
        this.files = findAllRustFiles(`${this.projectRoot}/${srcFolderName}`)
    }

    public async addBlueprintsToView() {
        this.files.forEach(file => {
            const name = getBlueprintName(fs.readFileSync(file, 'utf8'))
            if (name) this.addBlueprint(name)
        })
    }

    public clear() {
        this.blueprints = []
        this.refresh()
    }

    public refresh(element?: vscode.TreeItem): any {
        this._onDidChangeTreeData.fire(element);
    }

    public addBlueprint(name: string) {
        this.blueprints.push(name)
        console.log('REFRESH')
        this.refresh()
    }

    getTreeItem(element: Blueprint): vscode.TreeItem {
        return element
    }

    getChildren(element?: Element): Thenable<Element[]> {
        let items: Blueprint[] = []

        if (element) {

        } else {
            for (let blueprint of this.blueprints) {
                console.log('pushing', blueprint)
                items.push(new Blueprint(blueprint))
            }
        }

        return Promise.resolve(items)
    }
}

class Blueprint extends vscode.TreeItem {
    contextValue = 'blueprint'

    constructor(
        public readonly blueprint: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    ) {
        super(blueprint, collapsibleState)
    }
}