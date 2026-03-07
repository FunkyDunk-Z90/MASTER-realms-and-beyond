/**
 * @rnb/types - Byte Burger Cart Types
 * Shopping cart management and checkout
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

// ============================================================================
// CART ITEM
// ============================================================================

export interface I_CartItem {
    id: string // Unique item ID in cart
    menuItemId: T_ObjectId
    name: string
    price: number
    quantity: number
    subtotal: number
    modifiers?: {
        name: string
        price: number
    }[]
    specialInstructions?: string
    addedAt: T_Timestamp
}

// ============================================================================
// CART
// ============================================================================

export interface I_Cart {
    id: T_ObjectId
    customerId?: T_ObjectId
    sessionId?: string // For anonymous users
    items: I_CartItem[]
    itemCount: number
    subtotal: number
    tax: number
    discount?: {
        code?: string
        type: 'percentage' | 'fixed'
        amount: number
        reason?: string
    }
    deliveryFee?: number
    total: number
    orderType: 'dine_in' | 'takeout' | 'delivery'
    deliveryAddress?: {
        street: string
        city: string
        state: string
        zip: string
        latitude?: number
        longitude?: number
    }
    notes?: string
    abandonedAt?: T_Timestamp
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// CART OPERATIONS
// ============================================================================

export interface I_AddToCartRequest {
    menuItemId: T_ObjectId
    quantity: number
    modifiers?: {
        name: string
        price: number
    }[]
    specialInstructions?: string
}

export interface I_UpdateCartItemRequest {
    cartItemId: string
    quantity?: number
    modifiers?: {
        name: string
        price: number
    }[]
    specialInstructions?: string
}

export interface I_RemoveFromCartRequest {
    cartItemId: string
}

export interface I_ClearCartRequest {
    cartId: T_ObjectId
}

export interface I_UpdateCartRequest {
    orderType?: 'dine_in' | 'takeout' | 'delivery'
    deliveryAddress?: {
        street: string
        city: string
        state: string
        zip: string
        latitude?: number
        longitude?: number
    }
    notes?: string
}

export interface I_ApplyDiscountCodeRequest {
    cartId: T_ObjectId
    code: string
}

export interface I_RemoveDiscountRequest {
    cartId: T_ObjectId
}

// ============================================================================
// CART RESPONSES
// ============================================================================

export interface I_CartResponse {
    success: boolean
    data?: I_Cart
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_AddToCartResponse {
    success: boolean
    data?: {
        cart: I_Cart
        addedItem: I_CartItem
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// DISCOUNT/PROMOTION
// ============================================================================

export enum E_DiscountType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed',
    FREE_ITEM = 'free_item',
    LOYALTY_POINTS = 'loyalty_points',
}

export interface I_DiscountCode {
    id: T_ObjectId
    code: string
    description?: string
    type: E_DiscountType
    value: number
    maxUses?: number
    currentUses: number
    minOrderAmount?: number
    maxDiscount?: number
    validFrom: T_Timestamp
    validUntil: T_Timestamp
    active: boolean
    applicableItems?: T_ObjectId[] // If empty, applies to all
    createdAt: T_Timestamp
}

export interface I_ValidateDiscountRequest {
    code: string
    cartTotal: number
}

export interface I_ValidateDiscountResponse {
    success: boolean
    data?: {
        code: string
        discount: number
        discountType: E_DiscountType
        message?: string
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// CART ABANDONMENT
// ============================================================================

export interface I_AbandonedCart {
    id: T_ObjectId
    customerId?: T_ObjectId
    cartData: I_Cart
    abandonedAt: T_Timestamp
    recoveryEmailSent?: T_Timestamp
    recoveryCodeSent?: T_Timestamp
    recoveryCode?: string
    recovered: boolean
    recoveryAttempts: number
}

export interface I_RecoverAbandonedCartRequest {
    cartId: T_ObjectId
    customerId?: T_ObjectId
}

export interface I_AbandonmentRecoveryResponse {
    success: boolean
    data?: {
        cartId: T_ObjectId
        recoveryLink: string
        expiresAt: T_Timestamp
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// CART CALCULATIONS
// ============================================================================

export interface I_CartCalculation {
    subtotal: number
    itemCount: number
    discountAmount: number
    tax: number
    deliveryFee?: number
    total: number
    breakdown: {
        items: {
            name: string
            quantity: number
            price: number
            subtotal: number
        }[]
        subtotal: number
        discount: number
        tax: number
        delivery?: number
        total: number
    }
}

export interface I_CalculateCartRequest {
    items: I_CartItem[]
    orderType: 'dine_in' | 'takeout' | 'delivery'
    discountCode?: string
    deliveryZip?: string
}

export interface I_CalculateCartResponse {
    success: boolean
    data?: I_CartCalculation
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// CART PERSISTENCE
// ============================================================================

export interface I_SaveCartRequest {
    customerId: T_ObjectId
    cart: I_Cart
}

export interface I_GetCartRequest {
    customerId?: T_ObjectId
    sessionId?: string
}

export interface I_MergeCartsRequest {
    sourceCartId: T_ObjectId
    targetCartId: T_ObjectId
}

export interface I_CartSyncRequest {
    customerId: T_ObjectId
    localCart: I_Cart
    serverCart?: I_Cart
}

export interface I_CartSyncResponse {
    success: boolean
    data?: {
        mergedCart: I_Cart
        conflicts?: {
            itemId: string
            localQuantity: number
            serverQuantity: number
        }[]
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}
