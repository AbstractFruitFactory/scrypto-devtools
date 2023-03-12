"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec_showAccount = exports.exec_showLedger = exports.exec_createAccount = void 0;
const ramda_1 = require("ramda");
const parsers_1 = require("../parsers");
const resim_commands_1 = require("../resim-commands");
const execute_shell_1 = require("./execute-shell");
exports.exec_createAccount = (0, ramda_1.pipe)(resim_commands_1.newAccount, execute_shell_1.execShell, (0, ramda_1.andThen)(parsers_1.parseNewAccount), (0, ramda_1.andThen)((account) => __awaiter(void 0, void 0, void 0, function* () {
    return (Object.assign(Object.assign({}, account), yield (0, exports.exec_showAccount)(account.address)));
})));
exports.exec_showLedger = (0, ramda_1.pipe)(resim_commands_1.showLedger, execute_shell_1.execShell, (0, ramda_1.andThen)(parsers_1.parseShowLedger));
exports.exec_showAccount = (0, ramda_1.pipe)(resim_commands_1.showAccount, execute_shell_1.execShell, (0, ramda_1.andThen)(parsers_1.parseShowAccount));
//# sourceMappingURL=actions.js.map