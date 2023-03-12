"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execShell = void 0;
const cp = require("child_process");
const execShell = (cmd) => new Promise((resolve, reject) => {
    cp.exec(cmd, (err, out) => err ? reject(err) : resolve(out));
});
exports.execShell = execShell;
//# sourceMappingURL=execute-shell.js.map