/**
 * @rnb/types - Byte Burger Customer Types
 * Customer profiles and accounts
 */

import type {
    T_ObjectId,
    T_Timestamp,
    I_User,
} from '../global/common/commonIndex'

export interface I_ByteBurgerCustomer extends I_User {
    phone?: string
    preferences: {
        favoriteItems?: T_ObjectId[]
        dietaryRestrictions?: string[]
        spiceLevel?: number
        theme: 'light' | 'dark' | 'retro'
    }
    deliveryAddress?: {
        street: string
        city: string
        state: string
        zip: string
        latitude?: number
        longitude?: number
    }
    billingAddress?: {
        street: string
        city: string
        state: string
        zip: string
    }
    paymentMethods?: Array<{
        id: T_ObjectId
        type: 'card' | 'wallet'
        last4: string
        default: boolean
    }>
    accountStatus: 'active' | 'suspended' | 'deleted'
}

export interface I_UpdateCustomerRequest {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    avatar?: string
    preferences?: {
        favoriteItems?: T_ObjectId[]
        dietaryRestrictions?: string[]
        spiceLevel?: number
        theme?: 'light' | 'dark' | 'retro'
    }
    deliveryAddress?: {
        street: string
        city: string
        state: string
        zip: string
    }
    billingAddress?: {
        street: string
        city: string
        state: string
        zip: string
    }
}

export interface I_CustomerStats {
    totalOrders: number
    totalSpent: number
    favoriteItem?: T_ObjectId
    averageOrderValue: number
    memberSince: T_Timestamp
    lastOrderDate?: T_Timestamp
}
