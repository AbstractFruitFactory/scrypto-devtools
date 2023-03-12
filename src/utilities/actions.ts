import { andThen, pipe } from "ramda";
import { parseNewAccount, parsePublishPackage, parseShowAccount, parseShowLedger } from "../parsers";
import { newAccount, publishPackage, showAccount, showLedger } from "../resim-commands";
import { execShell } from "./execute-shell";

export const exec_createAccount = pipe(
    newAccount,
    execShell,
    andThen(parseNewAccount),
    andThen(async account => ({
        ...account,
        ...await exec_showAccount(account.address)
    }))
)

export const exec_showLedger = pipe(
    showLedger,
    execShell,
    andThen(parseShowLedger)
)

export const exec_showAccount = pipe(
    showAccount,
    execShell,
    andThen(parseShowAccount)
)

export const exec_publishPackage = pipe(
    publishPackage,
    execShell,
    andThen(parsePublishPackage)
)