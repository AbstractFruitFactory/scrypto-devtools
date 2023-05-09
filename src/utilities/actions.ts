import { andThen, pipe } from "ramda";
import { parseNewAccount, parsePublishPackage, parseShowAccount, parseShowComponent, parseShowLedger } from "../parsers";
import { callFunction, callMethod, exportABI, newAccount, publishPackage, resetLedger, show, showLedger } from "../resim-commands";
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
    show,
    execShell,
    andThen(parseShowAccount)
)

export const exec_publishPackage = pipe(
    publishPackage,
    execShell,
    andThen(parsePublishPackage)
)

export const exec_exportABI = pipe(
    exportABI,
    execShell
)

export const exec_callFunction = pipe(
    callFunction,
    execShell
)

export const exec_callMethod = pipe(
    callMethod,
    execShell
)

export const exec_showComponent = pipe(
    show,
    execShell,
    andThen(parseShowComponent)
)

export const exec_resetLedger = pipe(
    resetLedger,
    execShell
)