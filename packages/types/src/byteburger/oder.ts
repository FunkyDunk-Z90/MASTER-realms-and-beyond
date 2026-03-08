/**
 * @rnb/types - Byte Burger Order Types
 * Customer orders and order management
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export type E_OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'delivered'
    | 'completed'
    | 'cancelled'

export type E_OrderType = 'dine_in' | 'takeout' | 'delivery'

export interface I_OrderItem {
    menuItemId: T_ObjectId
    name: string
    quantity: number
    price: number
    specialInstructions?: string
    modifiers?: Array<{
        name: string
        price: number
    }>
}

export interface I_Order {
    id: T_ObjectId
    customerId?: T_ObjectId
    items: I_OrderItem[]
    subtotal: number
    tax: number
    discount?: number
    deliveryFee?: number
    total: number
    status: E_OrderStatus
    orderType: E_OrderType
    estimatedReadyTime?: T_Timestamp
    createdAt: T_Timestamp
    completedAt?: T_Timestamp
    notes?: string
    trackingNumber?: string
}

export interface I_CreateOrderRequest {
    items: Array<{
        menuItemId: string
        quantity: number
        specialInstructions?: string
        modifiers?: Array<{
            name: string
            price: number
        }>
    }>
    orderType: E_OrderType
    customerId?: string
    notes?: string
}

export interface I_UpdateOrderStatusRequest {
    status: E_OrderStatus
    notes?: string
}

export interface I_OrderTracking {
    orderId: T_ObjectId
    status: E_OrderStatus
    estimatedTime?: T_Timestamp
    currentLocation?: {
        latitude: number
        longitude: number
    }
    driverInfo?: {
        name: string
        phone: string
        vehicle: string
    }
}
