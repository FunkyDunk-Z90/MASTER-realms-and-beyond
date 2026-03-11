// Customer types are derived from Zod schemas in @rnb/validators.

export type {
    T_CustomerPreferences,
    T_CustomerAddress,
    T_UpdateCustomerRequest,
    T_CustomerStats,
} from '@rnb/validators'

import type {
    T_CustomerPreferences,
    T_CustomerAddress,
    T_UpdateCustomerRequest,
    T_CustomerStats,
} from '@rnb/validators'

export type I_UpdateCustomerRequest = T_UpdateCustomerRequest
export type I_CustomerStats = T_CustomerStats
export type I_CustomerPreferences = T_CustomerPreferences
export type I_CustomerAddress = T_CustomerAddress
