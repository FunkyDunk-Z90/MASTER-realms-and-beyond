/**
 * @rnb/types - Byte Burger Payment Types
 * Payment processing and transaction management
 */

import { T_ObjectId, T_Timestamp } from './commonIndex'

// ============================================================================
// PAYMENT METHOD
// ============================================================================

export enum E_PaymentMethodType {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    DIGITAL_WALLET = 'digital_wallet',
    PAYPAL = 'paypal',
    APPLE_PAY = 'apple_pay',
    GOOGLE_PAY = 'google_pay',
    CASH = 'cash',
    GIFT_CARD = 'gift_card',
    LOYALTY_POINTS = 'loyalty_points',
}

// FIX 1: Alias added so sales types can use E_PaymentMethod interchangeably
export type E_PaymentMethod = E_PaymentMethodType

export interface I_CreditCard {
    cardNumber: string // Last 4 digits or masked
    expiryMonth: number
    expiryYear: number
    cardholderName: string
    cvv?: string // Only for immediate processing
    billingAddress?: {
        street: string
        city: string
        state: string
        zip: string
        country: string
    }
}

export interface I_PaymentMethod {
    id: T_ObjectId
    customerId?: T_ObjectId
    type: E_PaymentMethodType
    nickname?: string
    isDefault: boolean
    cardData?: I_CreditCard
    walletProvider?: string // For digital wallets
    tokenId?: string // Tokenized card reference
    expiresAt?: T_Timestamp
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// PAYMENT REQUEST
// ============================================================================

export interface I_PaymentRequest {
    amount: number
    currency: string
    paymentMethod: E_PaymentMethodType
    orderId: T_ObjectId
    customerId?: T_ObjectId
    metadata?: {
        orderType: 'dine_in' | 'takeout' | 'delivery'
        restaurantId?: T_ObjectId
        [key: string]: any
    }
    billingDetails?: {
        name: string
        email: string
        phone?: string
        address?: {
            street: string
            city: string
            state: string
            zip: string
            country: string
        }
    }
    shippingDetails?: {
        name: string
        address: {
            street: string
            city: string
            state: string
            zip: string
            country: string
        }
    }
    description?: string
}

export interface I_CardPaymentRequest extends I_PaymentRequest {
    paymentMethod:
        | E_PaymentMethodType.CREDIT_CARD
        | E_PaymentMethodType.DEBIT_CARD
    cardData: I_CreditCard
}

export interface I_DigitalWalletPaymentRequest extends I_PaymentRequest {
    paymentMethod:
        | E_PaymentMethodType.APPLE_PAY
        | E_PaymentMethodType.GOOGLE_PAY
    token: string
}

export interface I_SavePaymentMethodRequest {
    customerId: T_ObjectId
    type: E_PaymentMethodType
    nickname?: string
    isDefault?: boolean
    cardData?: I_CreditCard
    walletProvider?: string
    tokenId?: string
}

// ============================================================================
// PAYMENT TRANSACTION
// ============================================================================

// FIX 2: E_TransactionStatus was commented out, breaking all downstream types — restored
export enum E_TransactionStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    AUTHORIZED = 'authorized',
    CAPTURED = 'captured',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum E_PaymentGateway {
    STRIPE = 'stripe',
    SQUARE = 'square',
    PAYPAL = 'paypal',
    AUTHORIZE_NET = 'authorize_net',
    INTERNAL = 'internal',
}

export interface I_PaymentTransaction {
    id: T_ObjectId
    orderId: T_ObjectId
    customerId?: T_ObjectId
    amount: number
    currency: string
    status: E_TransactionStatus
    paymentMethod: E_PaymentMethodType
    gateway: E_PaymentGateway
    gatewayTransactionId: string // ID from payment processor
    gatewayReference?: string
    errorCode?: string
    errorMessage?: string

    // Card details (masked)
    cardLastFour?: string
    cardBrand?: string
    cardExpiryMonth?: number
    cardExpiryYear?: number

    // Timestamps
    initiatedAt: T_Timestamp
    authorizedAt?: T_Timestamp
    capturedAt?: T_Timestamp
    failedAt?: T_Timestamp
    refundedAt?: T_Timestamp

    // Refunds
    refunds: {
        id: T_ObjectId
        amount: number
        reason: string
        status: 'pending' | 'completed' | 'failed'
        initiatedAt: T_Timestamp
        completedAt?: T_Timestamp
    }[]

    // Risk assessment
    riskLevel?: 'low' | 'medium' | 'high'
    fraudScore?: number

    metadata?: {
        [key: string]: any
    }

    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// PAYMENT RESPONSES
// ============================================================================

export interface I_PaymentResponse {
    success: boolean
    data?: {
        transactionId: T_ObjectId
        status: E_TransactionStatus
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

export interface I_PaymentMethodResponse {
    success: boolean
    data?: I_PaymentMethod
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_PaymentMethodListResponse {
    success: boolean
    data: I_PaymentMethod[]
    timestamp: string
    requestId: string
}

export interface I_TransactionResponse {
    success: boolean
    data?: I_PaymentTransaction
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// REFUND OPERATIONS
// ============================================================================

export interface I_RefundRequest {
    transactionId: T_ObjectId
    amount: number
    reason: string
    notes?: string
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

// ============================================================================
// INVOICE
// ============================================================================

export interface I_Invoice {
    id: T_ObjectId
    orderId: T_ObjectId
    customerId?: T_ObjectId
    number: string // Invoice number
    date: T_Timestamp
    dueDate?: T_Timestamp

    lineItems: {
        description: string
        quantity: number
        unitPrice: number
        subtotal: number
    }[]

    subtotal: number
    tax: number
    discount?: number
    total: number

    payments: {
        transactionId: T_ObjectId
        amount: number
        date: T_Timestamp
        method: E_PaymentMethodType
    }[]

    status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled'

    notes?: string

    createdAt: T_Timestamp
    sentAt?: T_Timestamp
    paidAt?: T_Timestamp
}

export interface I_GenerateInvoiceRequest {
    orderId: T_ObjectId
    includeItemDetails?: boolean
    sendEmail?: boolean
}

export interface I_InvoiceResponse {
    success: boolean
    data?: I_Invoice
    downloadUrl?: string
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// PAYMENT GATEWAY WEBHOOKS
// ============================================================================

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

// ============================================================================
// PAYMENT FRAUD DETECTION
// ============================================================================

export interface I_FraudCheck {
    transactionId: T_ObjectId
    score: number // 0-100
    riskLevel: 'low' | 'medium' | 'high'
    factors: {
        factor: string
        weight: number
        value: boolean
    }[]
    recommendation: 'approve' | 'review' | 'deny'
    flags: string[]
}

export interface I_FraudCheckRequest {
    transactionId: T_ObjectId
    amount: number
    paymentMethod: E_PaymentMethodType
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

// ============================================================================
// PAYMENT ANALYTICS
// ============================================================================

export interface I_PaymentStats {
    period: {
        startDate: T_Timestamp
        endDate: T_Timestamp
    }

    totalTransactions: number
    totalRevenue: number
    averageTransaction: number

    byPaymentMethod: {
        [key in E_PaymentMethodType]?: {
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
        byReason: {
            [reason: string]: number
        }
    }

    fraud: {
        flaggedTransactions: number
        deniedTransactions: number
        chargebackCount: number
    }
}

// ============================================================================
// PCI COMPLIANCE
// ============================================================================

export interface I_PCICompliance {
    enabled: boolean
    level: 1 | 2 | 3 | 4
    certificationStatus: 'compliant' | 'non_compliant' | 'pending'
    lastAudit: T_Timestamp
    nextAudit: T_Timestamp
    cardDataEncrypted: boolean
    useTokenization: boolean
}
