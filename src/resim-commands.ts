export const newAccount = () => `resim new-account`

export const showAccount = (accountAddress: string) =>  `resim show ${accountAddress}`

export const setDefaultAccount = (accountAddress: string, privateKey: string) => `resim set-default-account ${accountAddress} ${privateKey}`

export const newSimpleBadge = () => `resim new-simple-badge`

export const showLedger = () => `resim show-ledger`

export const publishPackage = (dir: string) => `resim publish ${dir}`