import type { AccountT, BlueprintT } from "./types"

type _Message<T extends string, C> = {
    type: T,
    content: C
}

export type Hello = _Message<'hello', {
    text: string
}>

export type Test = _Message<'test', {
    test: number
}>

export type CreateAccount = _Message<'create-account', {}>

export type CreateBadge = _Message<'create-badge', {}>

export type PublishPackage = _Message<'publish-package', {}>

export type AccountCreated = _Message<'account-created', {
    account: AccountT
}>

export type InstantiateBlueprint = _Message<'instantiate-blueprint', {
    blueprint: BlueprintT
}>

export type MessageFromWebview = CreateAccount | CreateBadge | PublishPackage | InstantiateBlueprint
export type MessageToWebview = AccountCreated