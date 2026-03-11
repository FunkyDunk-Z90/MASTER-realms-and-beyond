import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'
import { Z_PaymentMethodType } from './zod.payment'

// ─── Cart Item ────────────────────────────────────────────────────────────────

export const Z_CartItem = z.object({
    id: z.string(),
    menuItemId: Z_ObjectId,
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
    modifiers: z
        .array(
            z.object({
                name: z.string(),
                price: z.number(),
            })
        )
        .optional(),
    specialInstructions: z.string().optional(),
    addedAt: Z_Timestamp,
})

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const Z_CartDiscount = z.object({
    code: z.string().optional(),
    type: z.enum(['percentage', 'fixed']),
    amount: z.number(),
    reason: z.string().optional(),
})

export const Z_Cart = z.object({
    id: Z_ObjectId,
    customerId: Z_ObjectId.optional(),
    sessionId: z.string().optional(),
    items: z.array(Z_CartItem),
    itemCount: z.number(),
    subtotal: z.number(),
    tax: z.number(),
    discount: Z_CartDiscount.optional(),
    deliveryFee: z.number().optional(),
    total: z.number(),
    orderType: z.enum(['dine_in', 'takeout', 'delivery']),
    deliveryAddress: z
        .object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
        })
        .optional(),
    notes: z.string().optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Add To Cart Request ──────────────────────────────────────────────────────

export const Z_AddToCartRequest = z.object({
    menuItemId: Z_ObjectId,
    quantity: z.number().int().positive(),
    modifiers: z
        .array(
            z.object({
                name: z.string(),
                price: z.number(),
            })
        )
        .optional(),
    specialInstructions: z.string().optional(),
})

// ─── Discount Code ────────────────────────────────────────────────────────────

export const Z_DiscountCode = z.object({
    id: Z_ObjectId,
    code: z.string(),
    type: z.enum(['percentage', 'fixed', 'free_item', 'loyalty_points']),
    value: z.number(),
    currentUses: z.number(),
    validFrom: Z_Timestamp,
    validUntil: Z_Timestamp,
    active: z.boolean(),
})

// ─── Loyalty Tier ─────────────────────────────────────────────────────────────

export const Z_TierLevel = z.enum([
    'basic',
    'silver',
    'gold',
    'platinum',
    'retro_legend',
])

// ─── Loyalty Account ──────────────────────────────────────────────────────────

export const Z_LoyaltyAccount = z.object({
    id: Z_ObjectId,
    customerId: Z_ObjectId,
    points: z.number(),
    totalPointsEarned: z.number(),
    totalPointsRedeemed: z.number(),
    tier: Z_TierLevel,
    joinDate: Z_Timestamp,
    lastPointsEarned: Z_Timestamp.optional(),
    nextTierAt: z.number().optional(),
})

// ─── Achievement ──────────────────────────────────────────────────────────────

export const Z_Achievement = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    unlockedAt: Z_Timestamp.optional(),
    progress: z.number().optional(),
    maxProgress: z.number().optional(),
})

// ─── Reward ───────────────────────────────────────────────────────────────────

export const Z_Reward = z.object({
    id: Z_ObjectId,
    name: z.string(),
    description: z.string(),
    pointsCost: z.number(),
    discount: z.number().optional(),
    freeItem: Z_ObjectId.optional(),
    expiresAt: z.string().optional(),
})

// ─── Points Transaction ───────────────────────────────────────────────────────

export const Z_PointsTransaction = z.object({
    id: Z_ObjectId,
    customerId: Z_ObjectId,
    amount: z.number(),
    type: z.enum(['earn', 'redeem', 'adjust', 'bonus']),
    description: z.string(),
    relatedOrderId: Z_ObjectId.optional(),
    timestamp: Z_Timestamp,
})

// ─── Order ────────────────────────────────────────────────────────────────────

export const Z_OrderStatus = z.enum([
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'picked_up',
    'delivered',
    'completed',
    'cancelled',
])

export const Z_OrderType = z.enum(['dine_in', 'takeout', 'delivery'])

export const Z_OrderItem = z.object({
    menuItemId: Z_ObjectId,
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number(),
    specialInstructions: z.string().optional(),
    modifiers: z
        .array(z.object({ name: z.string(), price: z.number() }))
        .optional(),
})

export const Z_Order = z.object({
    id: Z_ObjectId,
    customerId: Z_ObjectId.optional(),
    items: z.array(Z_OrderItem),
    subtotal: z.number(),
    tax: z.number(),
    discount: z.number().optional(),
    deliveryFee: z.number().optional(),
    total: z.number(),
    status: Z_OrderStatus,
    orderType: Z_OrderType,
    estimatedReadyTime: Z_Timestamp.optional(),
    createdAt: Z_Timestamp,
    completedAt: Z_Timestamp.optional(),
    notes: z.string().optional(),
    trackingNumber: z.string().optional(),
})

export const Z_CreateOrderRequest = z.object({
    items: z.array(
        z.object({
            menuItemId: z.string(),
            quantity: z.number().int().positive(),
            specialInstructions: z.string().optional(),
            modifiers: z
                .array(z.object({ name: z.string(), price: z.number() }))
                .optional(),
        })
    ),
    orderType: Z_OrderType,
    customerId: z.string().optional(),
    notes: z.string().optional(),
})

export const Z_UpdateOrderStatusRequest = z.object({
    status: Z_OrderStatus,
    notes: z.string().optional(),
})

// ─── Customer ─────────────────────────────────────────────────────────────────

export const Z_CustomerPreferences = z.object({
    favoriteItems: z.array(Z_ObjectId).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    spiceLevel: z.number().optional(),
    theme: z.enum(['light', 'dark', 'retro']),
})

export const Z_CustomerAddress = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
})

export const Z_UpdateCustomerRequest = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    preferences: Z_CustomerPreferences.partial().optional(),
    deliveryAddress: Z_CustomerAddress.optional(),
    billingAddress: z
        .object({ street: z.string(), city: z.string(), state: z.string(), zip: z.string() })
        .optional(),
})

export const Z_CustomerStats = z.object({
    totalOrders: z.number().int().nonnegative(),
    totalSpent: z.number(),
    favoriteItem: Z_ObjectId.optional(),
    averageOrderValue: z.number(),
    memberSince: Z_Timestamp,
    lastOrderDate: Z_Timestamp.optional(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_CartItem = z.infer<typeof Z_CartItem>
export type T_CartDiscount = z.infer<typeof Z_CartDiscount>
export type T_Cart = z.infer<typeof Z_Cart>
export type T_AddToCartRequest = z.infer<typeof Z_AddToCartRequest>
export type T_DiscountCode = z.infer<typeof Z_DiscountCode>
export type T_TierLevel = z.infer<typeof Z_TierLevel>
export type T_LoyaltyAccount = z.infer<typeof Z_LoyaltyAccount>
export type T_Achievement = z.infer<typeof Z_Achievement>
export type T_Reward = z.infer<typeof Z_Reward>
export type T_PointsTransaction = z.infer<typeof Z_PointsTransaction>
export type T_OrderStatus = z.infer<typeof Z_OrderStatus>
export type T_OrderType = z.infer<typeof Z_OrderType>
export type T_OrderItem = z.infer<typeof Z_OrderItem>
export type T_Order = z.infer<typeof Z_Order>
export type T_CreateOrderRequest = z.infer<typeof Z_CreateOrderRequest>
export type T_UpdateOrderStatusRequest = z.infer<typeof Z_UpdateOrderStatusRequest>
export type T_CustomerPreferences = z.infer<typeof Z_CustomerPreferences>
export type T_CustomerAddress = z.infer<typeof Z_CustomerAddress>
export type T_UpdateCustomerRequest = z.infer<typeof Z_UpdateCustomerRequest>
export type T_CustomerStats = z.infer<typeof Z_CustomerStats>
