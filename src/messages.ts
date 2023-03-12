import type { AccountT } from "./types"

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

export type AccountCreated = _Message<'account-created', {
    account: AccountT
}>

export type MessageFromWebview = CreateAccount | CreateBadge
export type MessageToWebview = AccountCreated