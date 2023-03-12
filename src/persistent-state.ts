import { ExtensionContext } from "vscode";

export const store = (store: ExtensionContext['globalState']) => ({
    packageAddress: packageAddress(store),
    account: account(store)
})

const packageAddress = (store: ExtensionContext['globalState']) => ({
    get: () => store.get<string>('packageAddress'),
    set: (value: string) => store.update('packageAddress', value)
})

const account = (store: ExtensionContext['globalState']) => ({
    get: (address: string) => store.get<{ publicKey: string, privateKey: string }>(address),
    set: (address: string, value: { publicKey: string, privateKey: string }) => store.update(address, value)
})