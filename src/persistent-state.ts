import { ExtensionContext } from "vscode";

export const store = (store: ExtensionContext['globalState']) => ({
    account: account(store)
})

const account = (store: ExtensionContext['globalState']) => ({
    get: (address: string) => store.get<{ publicKey: string, privateKey: string }>(address),
    set: (address: string, value: { publicKey: string, privateKey: string }) => store.update(address, value)
})