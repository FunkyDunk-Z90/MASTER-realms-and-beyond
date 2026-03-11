// All inventory types are derived from Zod schemas in @rnb/validators.

export type {
    T_InventoryUnit,
    T_StockMovementType,
    T_InventoryStatus,
    T_PurchaseOrderStatus,
    T_InventoryItem,
    T_Supplier,
} from '@rnb/validators'

import type {
    T_InventoryUnit,
    T_StockMovementType,
    T_InventoryStatus,
    T_PurchaseOrderStatus,
    T_InventoryItem,
    T_Supplier,
} from '@rnb/validators'

export type E_InventoryUnit = T_InventoryUnit
export type E_StockMovementType = T_StockMovementType
export type E_InventoryStatus = T_InventoryStatus
export type E_PurchaseOrderStatus = T_PurchaseOrderStatus
export type I_InventoryItem = T_InventoryItem
export type I_Supplier = T_Supplier
