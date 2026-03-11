// All menu types are derived from Zod schemas in @rnb/validators.

export type {
    T_MenuItem,
    T_CreateMenuItemRequest,
    T_MenuCategory,
    T_NutritionalInfo,
} from '@rnb/validators'

import type { T_MenuItem, T_CreateMenuItemRequest, T_MenuCategory, T_NutritionalInfo } from '@rnb/validators'

export type I_MenuItem = T_MenuItem
export type I_CreateMenuItemRequest = T_CreateMenuItemRequest
export type I_MenuCategory = T_MenuCategory
export type I_NutritionalInfo = T_NutritionalInfo
