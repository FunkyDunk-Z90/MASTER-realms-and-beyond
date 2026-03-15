import { Schema } from 'mongoose'
import { T_Address, T_PhoneNumber, T_Contact } from '@rnb/validators'

const addressSchema = new Schema<T_Address>(
    {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        businessName: String,
        country: String,
        county: String,
        postcode: { type: String, required: true },
    },
    { _id: false }
)

const phoneSchema = new Schema<T_PhoneNumber>(
    {
        countryCode: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    { _id: false }
)

export const contactSchema = new Schema<T_Contact>(
    {
        address: addressSchema,
        phone: phoneSchema,
    },
    { _id: false }
)
