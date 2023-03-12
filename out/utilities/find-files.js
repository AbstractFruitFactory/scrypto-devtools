"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRustFiles = void 0;
const fs = require("fs");
const findAllRustFiles = (rootPath) => searchFiles(rootPath, /.*.rs/);
exports.findAllRustFiles = findAllRustFiles;
const searchFiles = (dir, pattern = /\.*/, filelist = []) => {
    let files = fs.readdirSync(dir);
    files.forEach(function (file) {
        const filePath = `${dir}/${file}`;
        if (fs.statSync(filePath).isDirectory()) {
            filelist = searchFiles(filePath, pattern, filelist);
        }
        else if (pattern.test(file)) {
            filelist.push(filePath);
        }
    });
    return filelist;
};
//# sourceMappingURL=find-files.js.map