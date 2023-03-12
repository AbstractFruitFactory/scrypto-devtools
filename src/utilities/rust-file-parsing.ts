export const getBlueprintName = (fileContents: string): string | undefined => {
    if(fileContents.search(/blueprint!/) === -1) return undefined
    
    const blueprintNames = fileContents.match(/impl .* {/)?.map(str => str.split(' ')[1])

    if (!blueprintNames) return undefined

    // TODO support several blueprints in one file
    return blueprintNames[0]
}