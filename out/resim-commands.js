"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showLedger = exports.newSimpleBadge = exports.setDefaultAccount = exports.showAccount = exports.newAccount = void 0;
const newAccount = () => `resim new-account`;
exports.newAccount = newAccount;
const showAccount = (accountAddress) => `resim show ${accountAddress}`;
exports.showAccount = showAccount;
const setDefaultAccount = (accountAddress, privateKey) => `resim set-default-account ${accountAddress} ${privateKey}`;
exports.setDefaultAccount = setDefaultAccount;
const newSimpleBadge = () => `resim new-simple-badge`;
exports.newSimpleBadge = newSimpleBadge;
const showLedger = () => `resim show-ledger`;
exports.showLedger = showLedger;
//# sourceMappingURL=resim-commands.js.map