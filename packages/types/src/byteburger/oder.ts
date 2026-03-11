// All order types are derived from Zod schemas in @rnb/validators.

export type {
    T_OrderStatus,
    T_OrderType,
    T_OrderItem,
    T_Order,
    T_CreateOrderRequest,
    T_UpdateOrderStatusRequest,
} from '@rnb/validators'

import type {
    T_OrderStatus,
    T_OrderType,
    T_OrderItem,
    T_Order,
    T_CreateOrderRequest,
    T_UpdateOrderStatusRequest,
} from '@rnb/validators'

export type E_OrderStatus = T_OrderStatus
export type E_OrderType = T_OrderType
export type I_OrderItem = T_OrderItem
export type I_Order = T_Order
export type I_CreateOrderRequest = T_CreateOrderRequest
export type I_UpdateOrderStatusRequest = T_UpdateOrderStatusRequest
