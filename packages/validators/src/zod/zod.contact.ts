import { z } from 'zod'

export const Z_Address = z.object({
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    companyName: z.string().optional(),
    city: z.string(),
    county: z.string().optional(),
    postcode: z.string(),
    country: z.string().optional(),
})

export const Z_PhoneNumber = z.object({
    countryCode: z.string(),
    phoneNumber: z.string(),
})

export const Z_Contact = z.object({
    address: Z_Address,
    phone: Z_PhoneNumber,
    email: z.email(),
})

export type T_Address = z.infer<typeof Z_Address>
export type T_PhoneNumber = z.infer<typeof Z_PhoneNumber>
export type T_Contact = z.infer<typeof Z_Contact>
