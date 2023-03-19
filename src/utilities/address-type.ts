type AddressType =
    | 'resource'
    | 'account'
    | 'component'

export const getComponentAddressType = (address: string): AddressType => address.split('_')[0] as AddressType