// Contact types derived from Zod schemas in @rnb/validators.

export type {
    T_Address,
    T_PhoneNumber,
    T_Contact,
    T_ContactProps,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type { T_Address, T_PhoneNumber, T_Contact, T_ContactProps } from '@rnb/validators'

export type I_Address = T_Address
export type I_PhoneNumber = T_PhoneNumber
export type I_Contact = T_Contact
export type I_ContactProps = T_ContactProps
