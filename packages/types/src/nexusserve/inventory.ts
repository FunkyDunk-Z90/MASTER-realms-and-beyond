/**
 * @rnb/types - NexusServe Inventory Types
 * Stock management and inventory tracking
 */

import type { T_ObjectId, T_Timestamp } from '../global/common'

// ============================================================================
// INVENTORY ITEM
// ============================================================================

export enum E_InventoryUnit {
    PIECE = 'piece',
    KILOGRAM = 'kg',
    LITER = 'l',
    GRAM = 'g',
    OUNCE = 'oz',
    POUND = 'lb',
    MILLILITER = 'ml',
    GALLON = 'gal',
}

export interface I_InventoryItem {
    id: T_ObjectId
    companyId: T_ObjectId
    menuItemId?: T_ObjectId // If applicable
    sku: string
    name: string
    description?: string
    category: string

    quantity: {
        current: number
        minimum: number
        maximum: number
        unit: E_InventoryUnit
    }

    cost: {
        unitCost: number
        totalCost: number
        currency: string
        lastUpdated: T_Timestamp
    }

    supplier?: {
        supplierId: T_ObjectId
        supplierName: string
        partNumber?: string
        leadTimeDays?: number
    }

    storage: {
        location: string
        bin?: string
        expiryDate?: T_Timestamp
        batchNumber?: string
    }

    tracking: {
        barcode?: string
        rfidTag?: string
        serialNumber?: string
    }

    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'

    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// STOCK MOVEMENT
// ============================================================================

export enum E_StockMovementType {
    PURCHASE = 'purchase',
    SALE = 'sale',
    ADJUSTMENT = 'adjustment',
    WASTE = 'waste',
    RETURN = 'return',
    TRANSFER = 'transfer',
    DAMAGE = 'damage',
    SPOILAGE = 'spoilage',
    INVENTORY_COUNT = 'inventory_count',
}

export interface I_StockMovement {
    id: T_ObjectId
    inventoryItemId: T_ObjectId
    companyId: T_ObjectId

    type: E_StockMovementType
    quantity: number
    unit: E_InventoryUnit

    reason?: string
    notes?: string

    relatedOrder?: {
        orderId: T_ObjectId
        orderType: 'purchase' | 'sale' | 'return'
    }

    relatedEmployee?: T_ObjectId

    beforeQuantity: number
    afterQuantity: number

    timestamp: T_Timestamp
}

// ============================================================================
// INVENTORY OPERATIONS
// ============================================================================

export interface I_AddInventoryItemRequest {
    companyId: T_ObjectId
    sku: string
    name: string
    description?: string
    category: string
    quantity: number
    unit: E_InventoryUnit
    minimumQuantity: number
    maximumQuantity: number
    unitCost: number
    supplierId?: T_ObjectId
    storage: {
        location: string
        bin?: string
    }
}

export interface I_UpdateInventoryItemRequest {
    id: T_ObjectId
    name?: string
    description?: string
    category?: string
    minimumQuantity?: number
    maximumQuantity?: number
    unitCost?: number
    status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
    storage?: {
        location?: string
        bin?: string
        expiryDate?: T_Timestamp
    }
}

export interface I_AdjustStockRequest {
    inventoryItemId: T_ObjectId
    quantity: number
    type: E_StockMovementType
    reason?: string
    notes?: string
    referenceId?: T_ObjectId
}

export interface I_ReceiveStockRequest {
    companyId: T_ObjectId
    purchaseOrderId?: T_ObjectId
    items: {
        inventoryItemId: T_ObjectId
        quantityReceived: number
        unit: E_InventoryUnit
        condition?: 'good' | 'damaged' | 'incorrect'
        notes?: string
    }[]
    receivedDate?: T_Timestamp
    receivedBy?: T_ObjectId
}

export interface I_CountInventoryRequest {
    companyId: T_ObjectId
    items: {
        inventoryItemId: T_ObjectId
        countedQuantity: number
        unit: E_InventoryUnit
        notes?: string
    }[]
    countDate: T_Timestamp
    countedBy: T_ObjectId
}

export interface I_TransferInventoryRequest {
    fromCompanyId: T_ObjectId
    toCompanyId: T_ObjectId
    items: {
        inventoryItemId: T_ObjectId
        quantity: number
        unit: E_InventoryUnit
    }[]
    reason?: string
    date?: T_Timestamp
}

// ============================================================================
// INVENTORY RESPONSES
// ============================================================================

export interface I_InventoryResponse {
    success: boolean
    data?: I_InventoryItem
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_InventoryListResponse {
    success: boolean
    data: I_InventoryItem[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

export interface I_StockMovementResponse {
    success: boolean
    data?: I_StockMovement
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// INVENTORY ALERTS
// ============================================================================

export enum E_AlertType {
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    OVERSTOCK = 'overstock',
    EXPIRING_SOON = 'expiring_soon',
    EXPIRED = 'expired',
    DISCREPANCY = 'discrepancy',
}

export interface I_InventoryAlert {
    id: T_ObjectId
    companyId: T_ObjectId
    inventoryItemId: T_ObjectId

    type: E_AlertType
    severity: 'low' | 'medium' | 'high' | 'critical'

    message: string
    details?: {
        currentStock?: number
        minimumStock?: number
        expectedStock?: number
        actualStock?: number
        expiryDate?: T_Timestamp
    }

    acknowledged: boolean
    acknowledgedAt?: T_Timestamp
    acknowledgedBy?: T_ObjectId

    actionTaken?: string
    actionDate?: T_Timestamp

    createdAt: T_Timestamp
}

// ============================================================================
// INVENTORY REPORTS
// ============================================================================

export interface I_InventoryReport {
    companyId: T_ObjectId

    period: {
        startDate: T_Timestamp
        endDate: T_Timestamp
    }

    summary: {
        totalItems: number
        lowStockItems: number
        outOfStockItems: number
        totalValue: number
        turnoverRate: number // items sold / average inventory
    }

    byCategory: {
        category: string
        itemCount: number
        totalQuantity: number
        totalValue: number
        turnoverRate: number
    }[]

    topMovingItems: {
        itemId: T_ObjectId
        name: string
        quantitySold: number
        revenue: number
    }[]

    slowMovingItems: {
        itemId: T_ObjectId
        name: string
        daysSinceLastSale: number
        currentStock: number
    }[]

    variances: {
        itemId: T_ObjectId
        name: string
        expectedQuantity: number
        actualQuantity: number
        variance: number
        variancePercent: number
    }[]

    generatedAt: T_Timestamp
}

export interface I_GetInventoryReportRequest {
    companyId: T_ObjectId
    startDate: T_Timestamp
    endDate: T_Timestamp
    includeByCategory?: boolean
    includeVariances?: boolean
}

// ============================================================================
// SUPPLIER MANAGEMENT
// ============================================================================

export interface I_Supplier {
    id: T_ObjectId
    companyId: T_ObjectId
    name: string
    contact?: {
        email: string
        phone: string
        website?: string
    }
    address?: {
        street: string
        city: string
        state: string
        zip: string
        country: string
    }
    payment: {
        terms: string // e.g., "Net 30"
        currency: string
    }
    performance: {
        leadTimeDays: number
        qualityScore: number // 0-100
        reliabilityScore: number // 0-100
    }
    status: 'active' | 'inactive' | 'blocked'
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

export interface I_CreateSupplierRequest {
    companyId: T_ObjectId
    name: string
    email: string
    phone: string
    website?: string
    address?: {
        street: string
        city: string
        state: string
        zip: string
        country: string
    }
    paymentTerms: string
}

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

export enum E_PurchaseOrderStatus {
    DRAFT = 'draft',
    SENT = 'sent',
    CONFIRMED = 'confirmed',
    PARTIALLY_RECEIVED = 'partially_received',
    RECEIVED = 'received',
    CANCELLED = 'cancelled',
    CLOSED = 'closed',
}

export interface I_PurchaseOrder {
    id: T_ObjectId
    companyId: T_ObjectId
    supplierId: T_ObjectId
    poNumber: string

    items: {
        inventoryItemId: T_ObjectId
        quantity: number
        unit: E_InventoryUnit
        unitPrice: number
        subtotal: number
    }[]

    subtotal: number
    tax?: number
    shipping?: number
    total: number

    status: E_PurchaseOrderStatus
    orderDate: T_Timestamp
    deliveryDate?: T_Timestamp

    notes?: string
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}
