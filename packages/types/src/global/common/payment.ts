/**
 * @rnb/types - Payment Types
 * Core schemas are in @rnb/validators. Extended types and analytics live here.
 */

import type { T_ObjectId, T_Timestamp } from './commonIndex'

export type {
    T_PaymentMethodType,
    T_TransactionStatus,
    T_PaymentGateway,
    T_BillingAddress,
    T_CreditCard,
    T_PaymentMethod,
    T_PaymentRequest,
    T_Refund,
    T_PaymentTransaction,
    T_RefundRequest,
    T_Invoice,
    T_FraudCheck,
    T_PCICompliance,
} from '@rnb/validators'

import type {
    T_PaymentMethodType,
    T_TransactionStatus,
    T_PaymentGateway,
    T_CreditCard,
    T_PaymentMethod,
    T_PaymentTransaction,
    T_Invoice,
    T_FraudCheck,
    T_PCICompliance,
} from '@rnb/validators'

// ─── E_* / I_* Aliases ────────────────────────────────────────────────────────

export type E_PaymentMethodType = T_PaymentMethodType
export type E_PaymentMethod = T_PaymentMethodType
export type E_TransactionStatus = T_TransactionStatus
export type E_PaymentGateway = T_PaymentGateway
export type I_CreditCard = T_CreditCard
export type I_PaymentMethod = T_PaymentMethod
export type I_PaymentTransaction = T_PaymentTransaction
export type I_Invoice = T_Invoice
export type I_FraudCheck = T_FraudCheck
export type I_PCICompliance = T_PCICompliance

// ─── Extended Types (not in validators) ───────────────────────────────────────

export interface I_CardPaymentRequest {
    amount: number
    currency: string
    paymentMethod: 'credit_card' | 'debit_card'
    orderId: T_ObjectId
    customerId?: T_ObjectId
    cardData: T_CreditCard
    description?: string
}

export interface I_DigitalWalletPaymentRequest {
    amount: number
    currency: string
    paymentMethod: 'apple_pay' | 'google_pay'
    orderId: T_ObjectId
    customerId?: T_ObjectId
    token: string
    description?: string
}

export interface I_SavePaymentMethodRequest {
    customerId: T_ObjectId
    type: T_PaymentMethodType
    nickname?: string
    isDefault?: boolean
    cardData?: T_CreditCard
    walletProvider?: string
    tokenId?: string
}

export interface I_PaymentResponse {
    success: boolean
    data?: {
        transactionId: T_ObjectId
        status: T_TransactionStatus
        amount: number
        timestamp: T_Timestamp
    }
    error?: {
        code: string
        message: string
        gatewayCode?: string
    }
    timestamp: string
    requestId: string
}

export interface I_RefundResponse {
    success: boolean
    data?: {
        refundId: T_ObjectId
        status: 'pending' | 'completed' | 'failed'
        amount: number
        timestamp: T_Timestamp
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_GenerateInvoiceRequest {
    orderId: T_ObjectId
    includeItemDetails?: boolean
    sendEmail?: boolean
}

export interface I_PaymentGatewayWebhook {
    gatewayId: string
    event: string
    timestamp: T_Timestamp
    data: {
        transactionId?: string
        status?: string
        amount?: number
        [key: string]: any
    }
}

export interface I_WebhookSignature {
    signature: string
    timestamp: T_Timestamp
    nonce?: string
}

export interface I_FraudCheckRequest {
    transactionId: T_ObjectId
    amount: number
    paymentMethod: T_PaymentMethodType
    customerId?: T_ObjectId
    ipAddress?: string
    userAgent?: string
    billingAddress?: {
        street: string
        city: string
        state: string
        zip: string
    }
    shippingAddress?: {
        street: string
        city: string
        state: string
        zip: string
    }
}

export interface I_PaymentStats {
    period: {
        startDate: T_Timestamp
        endDate: T_Timestamp
    }
    totalTransactions: number
    totalRevenue: number
    averageTransaction: number
    byPaymentMethod: {
        [key in T_PaymentMethodType]?: {
            count: number
            totalAmount: number
            successRate: number
        }
    }
    byStatus: {
        successful: number
        failed: number
        pending: number
        refunded: number
    }
    refunds: {
        totalRefunded: number
        refundCount: number
        averageRefund: number
        byReason: { [reason: string]: number }
    }
    fraud: {
        flaggedTransactions: number
        deniedTransactions: number
        chargebackCount: number
    }
}
