/**
 * @rnb/types - NexusServe Sales & Transaction Types
 * POS transactions and sales reporting
 */

// FIX 3: Corrected import path to match the project's actual structure,
//         and explicitly import the shared enums this file depends on
import type { T_ObjectId, T_Timestamp } from './commonIndex'
import { E_PaymentMethodType, E_TransactionStatus } from './payment'

// FIX 4: E_PaymentMethod was used throughout but never defined in this file —
//         re-exported as a type alias for E_PaymentMethodType for consistency
export type E_PaymentMethod = E_PaymentMethodType

export interface I_SalesTransactionItem {
    menuItemId: T_ObjectId
    name: string
    quantity: number
    unitPrice: number
    subtotal: number
    specialInstructions?: string
    modifiers?: Array<{
        name: string
        price: number
    }>
}

export interface I_SalesTransaction {
    id: T_ObjectId
    companyId: T_ObjectId
    orderId: string
    items: I_SalesTransactionItem[]
    subtotal: number
    tax: number
    discount?: number
    discountReason?: string
    total: number
    paymentMethod: E_PaymentMethod
    status: E_TransactionStatus
    timestamp: T_Timestamp
    employeeId: T_ObjectId
    customer?: {
        id?: T_ObjectId
        name?: string
        phone?: string
        email?: string
        loyaltyId?: string
    }
    notes?: string
    refundedAmount?: number
    refundedAt?: T_Timestamp
}

export interface I_CreateTransactionRequest {
    items: Array<{
        menuItemId: string
        quantity: number
        specialInstructions?: string
    }>
    paymentMethod: E_PaymentMethod
    discount?: number
    customer?: {
        name?: string
        phone?: string
        email?: string
        loyaltyId?: string
    }
}

export interface I_SalesReport {
    period: {
        startDate: Date
        endDate: Date
    }
    totalTransactions: number
    totalRevenue: number
    totalTax: number
    totalDiscounts: number
    averageTransaction: number
    // FIX 5: E_PaymentMethod was not a valid enum at runtime — now resolves correctly
    //         via the alias above, making Record<> valid
    paymentMethodBreakdown: Record<E_PaymentMethod, number>
    topItems: Array<{
        itemId: T_ObjectId
        name: string
        sold: number
        revenue: number
    }>
    hourlyBreakdown: Array<{
        hour: number
        transactions: number
        revenue: number
    }>
}

export interface I_InventoryUsage {
    menuItemId: T_ObjectId
    name: string
    unitsSold: number
    revenueGenerated: number
    costOfGoodsSold?: number
}
