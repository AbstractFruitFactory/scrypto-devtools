type AddressType =
    | 'package'
    | 'resource'
    | 'account'
    | 'transaction'
    | 'component'

export const getAddressType = (address: string): AddressType => {
    const parts = address.split('_')
    return parts.length > 1 ? (parts[0] as AddressType) : 'transaction'
}