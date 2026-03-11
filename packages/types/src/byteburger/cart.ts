// All cart types are derived from Zod schemas in @rnb/validators.

export type {
    T_CartItem,
    T_CartDiscount,
    T_Cart,
    T_AddToCartRequest,
    T_DiscountCode,
} from '@rnb/validators'

import type { T_CartItem, T_CartDiscount, T_Cart, T_AddToCartRequest, T_DiscountCode } from '@rnb/validators'

export type I_CartItem = T_CartItem
export type I_CartDiscount = T_CartDiscount
export type I_Cart = T_Cart
export type I_AddToCartRequest = T_AddToCartRequest
export type I_DiscountCode = T_DiscountCode
