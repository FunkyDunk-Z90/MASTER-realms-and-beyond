import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_PaymentMethodType = z.enum([
    'credit_card',
    'debit_card',
    'digital_wallet',
    'paypal',
    'apple_pay',
    'google_pay',
    'cash',
    'gift_card',
    'loyalty_points',
])

export const Z_TransactionStatus = z.enum([
    'pending',
    'processing',
    'authorized',
    'captured',
    'failed',
    'cancelled',
    'refunded',
    'partially_refunded',
])

export const Z_PaymentGateway = z.enum([
    'stripe',
    'square',
    'paypal',
    'authorize_net',
    'internal',
])

// ─── Credit Card ──────────────────────────────────────────────────────────────

export const Z_BillingAddress = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
})

export const Z_CreditCard = z.object({
    cardNumber: z.string(),
    expiryMonth: z.number(),
    expiryYear: z.number(),
    cardholderName: z.string(),
    cvv: z.string().optional(),
    billingAddress: Z_BillingAddress.optional(),
})

// ─── Payment Method ───────────────────────────────────────────────────────────

export const Z_PaymentMethod = z.object({
    id: Z_ObjectId,
    customerId: Z_ObjectId.optional(),
    type: Z_PaymentMethodType,
    nickname: z.string().optional(),
    isDefault: z.boolean(),
    cardData: Z_CreditCard.optional(),
    walletProvider: z.string().optional(),
    tokenId: z.string().optional(),
    expiresAt: Z_Timestamp.optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Payment Request ──────────────────────────────────────────────────────────

export const Z_PaymentRequest = z.object({
    amount: z.number(),
    currency: z.string(),
    paymentMethod: Z_PaymentMethodType,
    orderId: Z_ObjectId,
    customerId: Z_ObjectId.optional(),
    description: z.string().optional(),
})

// ─── Payment Transaction ──────────────────────────────────────────────────────

export const Z_Refund = z.object({
    id: Z_ObjectId,
    amount: z.number(),
    reason: z.string(),
    status: z.enum(['pending', 'completed', 'failed']),
    initiatedAt: Z_Timestamp,
    completedAt: Z_Timestamp.optional(),
})

export const Z_PaymentTransaction = z.object({
    id: Z_ObjectId,
    orderId: Z_ObjectId,
    customerId: Z_ObjectId.optional(),
    amount: z.number(),
    currency: z.string(),
    status: Z_TransactionStatus,
    paymentMethod: Z_PaymentMethodType,
    gateway: Z_PaymentGateway,
    gatewayTransactionId: z.string(),
    riskLevel: z.enum(['low', 'medium', 'high']).optional(),
    fraudScore: z.number().optional(),
    refunds: z.array(Z_Refund),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Refund Request ───────────────────────────────────────────────────────────

export const Z_RefundRequest = z.object({
    transactionId: Z_ObjectId,
    amount: z.number(),
    reason: z.string(),
    notes: z.string().optional(),
})

// ─── Invoice ──────────────────────────────────────────────────────────────────

export const Z_InvoiceLineItem = z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    subtotal: z.number(),
})

export const Z_InvoicePayment = z.object({
    transactionId: Z_ObjectId,
    amount: z.number(),
    date: Z_Timestamp,
    method: Z_PaymentMethodType,
})

export const Z_Invoice = z.object({
    id: Z_ObjectId,
    orderId: Z_ObjectId,
    customerId: Z_ObjectId.optional(),
    number: z.string(),
    date: Z_Timestamp,
    dueDate: Z_Timestamp.optional(),
    lineItems: z.array(Z_InvoiceLineItem),
    subtotal: z.number(),
    tax: z.number(),
    discount: z.number().optional(),
    total: z.number(),
    payments: z.array(Z_InvoicePayment),
    status: z.enum(['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled']),
    notes: z.string().optional(),
    createdAt: Z_Timestamp,
    sentAt: Z_Timestamp.optional(),
    paidAt: Z_Timestamp.optional(),
})

// ─── Fraud Check ──────────────────────────────────────────────────────────────

export const Z_FraudFactor = z.object({
    factor: z.string(),
    weight: z.number(),
    value: z.boolean(),
})

export const Z_FraudCheck = z.object({
    transactionId: Z_ObjectId,
    score: z.number(),
    riskLevel: z.enum(['low', 'medium', 'high']),
    factors: z.array(Z_FraudFactor),
    recommendation: z.enum(['approve', 'review', 'deny']),
    flags: z.array(z.string()),
})

// ─── PCI Compliance ───────────────────────────────────────────────────────────

export const Z_PCICompliance = z.object({
    enabled: z.boolean(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    certificationStatus: z.enum(['compliant', 'non_compliant', 'pending']),
    lastAudit: Z_Timestamp,
    nextAudit: Z_Timestamp,
    cardDataEncrypted: z.boolean(),
    useTokenization: z.boolean(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_PaymentMethodType = z.infer<typeof Z_PaymentMethodType>
export type T_TransactionStatus = z.infer<typeof Z_TransactionStatus>
export type T_PaymentGateway = z.infer<typeof Z_PaymentGateway>
export type T_BillingAddress = z.infer<typeof Z_BillingAddress>
export type T_CreditCard = z.infer<typeof Z_CreditCard>
export type T_PaymentMethod = z.infer<typeof Z_PaymentMethod>
export type T_PaymentRequest = z.infer<typeof Z_PaymentRequest>
export type T_Refund = z.infer<typeof Z_Refund>
export type T_PaymentTransaction = z.infer<typeof Z_PaymentTransaction>
export type T_RefundRequest = z.infer<typeof Z_RefundRequest>
export type T_InvoiceLineItem = z.infer<typeof Z_InvoiceLineItem>
export type T_InvoicePayment = z.infer<typeof Z_InvoicePayment>
export type T_Invoice = z.infer<typeof Z_Invoice>
export type T_FraudFactor = z.infer<typeof Z_FraudFactor>
export type T_FraudCheck = z.infer<typeof Z_FraudCheck>
export type T_PCICompliance = z.infer<typeof Z_PCICompliance>
