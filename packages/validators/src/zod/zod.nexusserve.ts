import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'
import { Z_PaymentMethodType, Z_TransactionStatus } from './zod.payment'

// ─── Employee Enums ───────────────────────────────────────────────────────────

export const Z_EmployeeRole = z.enum(['staff', 'manager', 'admin'])

export const Z_EmployeeStatus = z.enum([
    'active',
    'inactive',
    'terminated',
    'on_leave',
])

// ─── Employee ─────────────────────────────────────────────────────────────────

export const Z_Employee = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    userId: Z_ObjectId,
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    role: Z_EmployeeRole,
    position: z.string(),
    department: z.string(),
    hireDate: z.string(),
    status: Z_EmployeeStatus,
    wage: z.object({
        hourly: z.number().optional(),
        salary: z.number().optional(),
        currency: z.string(),
    }),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_CreateEmployeeRequest = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    position: z.string(),
    department: z.string(),
    role: Z_EmployeeRole,
    hireDate: z.string().optional(),
    wage: z.object({
        hourly: z.number().optional(),
        salary: z.number().optional(),
        currency: z.string(),
    }),
})

export const Z_UpdateEmployeeRequest = Z_CreateEmployeeRequest.partial()

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const Z_NutritionalInfo = z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number().optional(),
    sugar: z.number().optional(),
})

export const Z_MenuItem = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    category: z.string(),
    image: z.string().optional(),
    availability: z.boolean(),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    nutritionalInfo: Z_NutritionalInfo.optional(),
    preparationTime: z.number().optional(),
    spiceLevel: z.number().optional(),
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_CreateMenuItemRequest = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    category: z.string(),
    image: z.string().optional(),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    nutritionalInfo: Z_NutritionalInfo.optional(),
    preparationTime: z.number().optional(),
})

export const Z_MenuCategory = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    name: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    displayOrder: z.number(),
})

// ─── Inventory Enums ──────────────────────────────────────────────────────────

export const Z_InventoryUnit = z.enum([
    'piece',
    'kg',
    'l',
    'g',
    'oz',
    'lb',
    'ml',
    'gal',
])

export const Z_StockMovementType = z.enum([
    'purchase',
    'sale',
    'adjustment',
    'waste',
    'return',
    'transfer',
    'damage',
    'spoilage',
    'inventory_count',
])

export const Z_InventoryStatus = z.enum([
    'in_stock',
    'low_stock',
    'out_of_stock',
    'discontinued',
])

export const Z_PurchaseOrderStatus = z.enum([
    'draft',
    'sent',
    'confirmed',
    'partially_received',
    'received',
    'cancelled',
    'closed',
])

// ─── Inventory Item ───────────────────────────────────────────────────────────

export const Z_InventoryItem = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    menuItemId: Z_ObjectId.optional(),
    sku: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category: z.string(),
    quantity: z.object({
        current: z.number(),
        minimum: z.number(),
        maximum: z.number(),
        unit: Z_InventoryUnit,
    }),
    cost: z.object({
        unitCost: z.number(),
        totalCost: z.number(),
        currency: z.string(),
        lastUpdated: Z_Timestamp,
    }),
    supplier: z
        .object({
            supplierId: Z_ObjectId,
            supplierName: z.string(),
            partNumber: z.string().optional(),
            leadTimeDays: z.number().optional(),
        })
        .optional(),
    storage: z.object({
        location: z.string(),
        bin: z.string().optional(),
        expiryDate: z.string().optional(),
        batchNumber: z.string().optional(),
    }),
    tracking: z.object({
        barcode: z.string().optional(),
        rfidTag: z.string().optional(),
        serialNumber: z.string().optional(),
    }),
    status: Z_InventoryStatus,
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Supplier ─────────────────────────────────────────────────────────────────

export const Z_Supplier = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    name: z.string(),
    contact: z
        .object({
            email: z.string(),
            phone: z.string(),
            website: z.string().optional(),
        })
        .optional(),
    address: z.object({}).optional(),
    payment: z.object({
        terms: z.string(),
        currency: z.string(),
    }),
    performance: z.object({
        leadTimeDays: z.number(),
        qualityScore: z.number(),
        reliabilityScore: z.number(),
    }),
    status: z.enum(['active', 'inactive', 'blocked']),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Shift Enums ──────────────────────────────────────────────────────────────

export const Z_ShiftStatus = z.enum([
    'scheduled',
    'checked_in',
    'checked_out',
    'completed',
    'cancelled',
    'no_show',
])

// ─── Shift ────────────────────────────────────────────────────────────────────

export const Z_Shift = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    employeeId: Z_ObjectId,
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    position: z.string(),
    breakDuration: z.number(),
    status: Z_ShiftStatus,
    actualCheckIn: Z_Timestamp.optional(),
    actualCheckOut: Z_Timestamp.optional(),
    notes: z.string().optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_ShiftSchedule = z.object({
    companyId: Z_ObjectId,
    date: z.string(),
    shifts: z.array(Z_Shift),
    totalHours: z.number(),
    employeesScheduled: z.number(),
})

// ─── Sales ────────────────────────────────────────────────────────────────────

export const Z_SalesTransactionItem = z.object({
    menuItemId: Z_ObjectId,
    name: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    subtotal: z.number(),
    specialInstructions: z.string().optional(),
    modifiers: z
        .array(
            z.object({
                name: z.string(),
                price: z.number(),
            })
        )
        .optional(),
})

export const Z_SalesTransaction = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    orderId: z.string(),
    items: z.array(Z_SalesTransactionItem),
    subtotal: z.number(),
    tax: z.number(),
    discount: z.number().optional(),
    discountReason: z.string().optional(),
    total: z.number(),
    paymentMethod: Z_PaymentMethodType,
    status: Z_TransactionStatus,
    timestamp: Z_Timestamp,
    employeeId: Z_ObjectId,
    customer: z
        .object({
            id: z.string().optional(),
            name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().optional(),
            loyaltyId: z.string().optional(),
        })
        .optional(),
    notes: z.string().optional(),
})

export const Z_CreateTransactionRequest = z.object({
    items: z.array(
        z.object({
            menuItemId: z.string(),
            quantity: z.number(),
            specialInstructions: z.string().optional(),
        })
    ),
    paymentMethod: Z_PaymentMethodType,
    discount: z.number().optional(),
    customer: z
        .object({
            id: z.string().optional(),
            name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().optional(),
            loyaltyId: z.string().optional(),
        })
        .optional(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_EmployeeRole = z.infer<typeof Z_EmployeeRole>
export type T_EmployeeStatus = z.infer<typeof Z_EmployeeStatus>
export type T_Employee = z.infer<typeof Z_Employee>
export type T_CreateEmployeeRequest = z.infer<typeof Z_CreateEmployeeRequest>
export type T_UpdateEmployeeRequest = z.infer<typeof Z_UpdateEmployeeRequest>
export type T_NutritionalInfo = z.infer<typeof Z_NutritionalInfo>
export type T_MenuItem = z.infer<typeof Z_MenuItem>
export type T_CreateMenuItemRequest = z.infer<typeof Z_CreateMenuItemRequest>
export type T_MenuCategory = z.infer<typeof Z_MenuCategory>
export type T_InventoryUnit = z.infer<typeof Z_InventoryUnit>
export type T_StockMovementType = z.infer<typeof Z_StockMovementType>
export type T_InventoryStatus = z.infer<typeof Z_InventoryStatus>
export type T_PurchaseOrderStatus = z.infer<typeof Z_PurchaseOrderStatus>
export type T_InventoryItem = z.infer<typeof Z_InventoryItem>
export type T_Supplier = z.infer<typeof Z_Supplier>
export type T_ShiftStatus = z.infer<typeof Z_ShiftStatus>
export type T_Shift = z.infer<typeof Z_Shift>
export type T_ShiftSchedule = z.infer<typeof Z_ShiftSchedule>
export type T_SalesTransactionItem = z.infer<typeof Z_SalesTransactionItem>
export type T_SalesTransaction = z.infer<typeof Z_SalesTransaction>
export type T_CreateTransactionRequest = z.infer<typeof Z_CreateTransactionRequest>
