export interface I_Address {
    addressLine1: string
    addressLine2?: string
    companyName?: string
    city: string
    county?: string
    postcode: string
    country?: string
}

export interface I_PhoneNumber {
    countryCode: string
    phoneNumber: string
}

export interface I_Contact {
    address: I_Address
    phone: I_PhoneNumber
}
