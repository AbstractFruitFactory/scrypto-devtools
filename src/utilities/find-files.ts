import * as fs from 'fs'

export const findAllRustFiles = (rootPath: string): string[] => searchFiles(rootPath, /.*\.rs/)

const searchFiles = (dir: string, pattern: RegExp, filelist: string[] = []): string[] => {
    let files = fs.readdirSync(dir)
    files.forEach(function (file: string) {
        const filePath: string = `${dir}/${file}`
        if (fs.statSync(filePath).isDirectory()) {
            searchFiles(filePath, pattern, filelist)
        } else if (pattern.test(file)) {
            filelist.push(filePath)
        }
    })
    return filelist
}