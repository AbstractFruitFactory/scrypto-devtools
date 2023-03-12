import * as cp from "child_process"

export const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        cp.exec(cmd, (err, out) => err ? reject(err) : resolve(out))
    })