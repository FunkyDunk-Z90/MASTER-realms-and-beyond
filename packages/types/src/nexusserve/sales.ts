// All sales types are derived from Zod schemas in @rnb/validators.

export type {
    T_SalesTransactionItem,
    T_SalesTransaction,
    T_CreateTransactionRequest,
} from '@rnb/validators'

import type {
    T_SalesTransactionItem,
    T_SalesTransaction,
    T_CreateTransactionRequest,
} from '@rnb/validators'

export type I_SalesTransactionItem = T_SalesTransactionItem
export type I_SalesTransaction = T_SalesTransaction
export type I_CreateTransactionRequest = T_CreateTransactionRequest
