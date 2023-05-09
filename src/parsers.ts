import { pipe } from "ramda";

export const parseNewAccount = (output: string) => ({
    address: pipe(
        () => output.substring(output.search('Account component address: ')).split(' ')[3],
        addressLine => addressLine.substring(addressLine.search('account'), addressLine.search('\n'))
    )(),
    publicKey: output.substring(output.search('Public key: ')).split(' ')[2],
    privateKey: output.substring(output.search('Private key: ')).split(' ')[2]
})

export const parseShowAccount = (output: string) => ({
    blueprint: {
        packageAddress: output.substring(output.search('package_address: '), output.search('blueprint_name')).split('package_address:')[1].replace(',', '').replace(' ', '').replace(' ', ''),
        name: output.substring(output.search('blueprint_name: '), output.search('Access Rules')).split('blueprint_name: ')[1].replace(' ', '').split('\"')[1]
    },
    resources: (() => {
        const resources = output.match(/{ amount: .* }/g)!
        const parsedResources = resources.map((resource, i) => ({
            amount: resource.match(/amount: \w*/)![0].split(' ')[1],
            resourceAddress: resource.match(/resource address: \w*/)![0].split(" ")[2],
            name: resource.match(/name: "\w*"/)?.[0].split(' ')[1].replace('"', '').replace('"', ''),
            symbol: resource.match(/symbol: "\w*"/)?.[0].split(' ')[1].replace('"', '').replace('"', ''),
            nonFungibles: output.substring(output.search(resource), output.search(resources[i + 1])).match(/NonFungible .*}/)?.map(nonFungibleRaw => ({
                id: nonFungibleRaw.match(/NonFungibleLocalId\(".*"\)/)?.[0].split("\"")[1]!
            }))
        }))

        return parsedResources
    })()
})

export const parseShowComponent = (output: string) => ({
    blueprint: {
        packageAddress: output.match(/package_sim.*,/)![0].replace(',', ''),
        name: output.match(/blueprint_name:.*}/)![0].split(" ")[1].split(`"`)[1]
    }
})

export const parseShowLedger = (output: string) => ({
    packages: output.substring(output.search('Packages'), output.search('Components'))
        .split('\n')
        .filter(line => line.includes('_'))
        .map(str => str.split(' ')[1]),

    components: output.substring(output.search('Components'), output.search('Resource Managers'))
        .split('\n')
        .filter(line => line.includes('_'))
        .map(str => str.split(' ')[1]),

    resourceManagers: output.substring(output.search('Resource Managers'), output.search('Current Epoch'))
        .split('\n')
        .filter(line => line.includes('_'))
        .map(str => str.split(' ')[1]),

    currentEpoch: output.substring(output.search('Current Epoch'), output.search('Current Time'))
        .split('Current Epoch: ')[1]
        .split('\n')[0],

    currentTime: output.substring(output.search('Current Time'))
        .split('Current Time: ')[1]
        .split('\n')[0]
})

export const parsePublishPackage = (output: string) => ({
    packageAddress: output.match(/package_.*/)![0]
})