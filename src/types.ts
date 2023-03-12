export type BlueprintT = {
    packageAddress: string,
    name: string
}

export type AccountT = {
    address: string,
    publicKey: string,
    privateKey: string,
    blueprint: BlueprintT
}