export type ABI = {
    package_address: string,
    blueprint_name: string,
    abi: {
        structure: {
            type: string,
            name: string,
            fields: {
                type: string,
                named: any[]
            }
        },
        fns: {
            ident: string,
            mutability: null | string,
            input: {
                type: string,
                name: string,
                fields: {
                    named: [argName: string, type: { type: string }][]
                }
            },
            output: {
                type: string,
            },
            export_name: string
        }[]
    }
}

export type PackageT = {
    address: string,
    blueprints: BlueprintT[]
}

export type BlueprintT = {
    name: string,
    abi: ABI
}

export type ComponentT = {
    address: string
    abi: ABI
}

export type AccountT = {
    address: string,
    publicKey: string,
    privateKey: string,
    blueprint: {
        packageAddress: string,
        name: string
    }
}