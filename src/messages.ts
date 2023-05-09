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

export type CallFunction = _Message<'call-function', {
    packageAddress: string
    blueprintName: string,
    fn: string,
    args: string[]
}>

export type CallMethod = _Message<'call-method', {
    componentAddress: string,
    fn: string,
    args: string[]
}>

export type Reset = _Message<'reset', {}>

export type MessageFromWebview = CreateAccount | CreateBadge | PublishPackage | InstantiateBlueprint | CallFunction | CallMethod | Reset
export type MessageToWebview = AccountCreated