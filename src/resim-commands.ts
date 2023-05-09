export const newAccount = () => `resim new-account`

export const show = (entityAddress: string) => `resim show ${entityAddress}`

export const setDefaultAccount = (accountAddress: string, privateKey: string) => `resim set-default-account ${accountAddress} ${privateKey}`

export const newSimpleBadge = () => `resim new-simple-badge`

export const showLedger = () => `resim show-ledger`

export const publishPackage = (dir: string) => `resim publish ${dir}`

export const callFunction = (packageAddress: string, blueprint: string, name: string, args: any[]) =>
    `resim call-function ${packageAddress} ${blueprint} ${name} ${args.join(' ')}`

export const callMethod = (componentAddress: string, name: string, args: any[]) =>
    `resim call-method ${componentAddress} ${name} ${args.join(' ')}`

export const exportABI = (packageAddress: string, blueprint: string) => `resim export-abi ${packageAddress} ${blueprint}`

export const resetLedger = () => `resim reset`