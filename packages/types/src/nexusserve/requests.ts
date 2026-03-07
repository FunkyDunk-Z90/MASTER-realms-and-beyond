// /**
//  * @rnb/types - NexusServe Request Types
//  * API request/response types for NexusServe operations
//  */

// import type { T_ObjectId, T_Timestamp } from '../global/common'

// // ============================================================================
// // EMPLOYEE REQUESTS
// // ============================================================================

// export interface I_CreateEmployeeRequest {
//     companyId: T_ObjectId
//     firstName: string
//     lastName: string
//     email: string
//     phone?: string
//     position: string
//     department: string
//     role: 'staff' | 'manager' | 'admin'
//     hireDate?: T_Timestamp
//     wage: {
//         hourly?: number
//         salary?: number
//         currency: string
//     }
//     emergencyContacts?: Array<{
//         name: string
//         relationship: string
//         phone: string
//     }>
// }

// export interface I_UpdateEmployeeRequest {
//     id: T_ObjectId
//     firstName?: string
//     lastName?: string
//     email?: string
//     phone?: string
//     position?: string
//     department?: string
//     role?: 'staff' | 'manager' | 'admin'
//     status?: 'active' | 'inactive' | 'terminated'
//     wage?: {
//         hourly?: number
//         salary?: number
//         currency?: string
//     }
// }

// export interface I_DeleteEmployeeRequest {
//     id: T_ObjectId
//     terminationDate?: T_Timestamp
//     terminationReason?: string
// }

// export interface I_ListEmployeesRequest {
//     companyId: T_ObjectId
//     department?: string
//     role?: 'staff' | 'manager' | 'admin'
//     status?: 'active' | 'inactive' | 'terminated'
//     limit?: number
//     offset?: number
// }

// // ============================================================================
// // SHIFT REQUESTS
// // ============================================================================

// export interface I_CreateShiftRequest {
//     companyId: T_ObjectId
//     employeeId: T_ObjectId
//     date: T_Timestamp
//     startTime: string // HH:MM format
//     endTime: string
//     position: string
//     breakDuration?: number // minutes
//     notes?: string
// }

// export interface I_UpdateShiftRequest {
//     id: T_ObjectId
//     date?: T_Timestamp
//     startTime?: string
//     endTime?: string
//     position?: string
//     breakDuration?: number
//     status?:
//         | 'scheduled'
//         | 'checked_in'
//         | 'checked_out'
//         | 'completed'
//         | 'cancelled'
//     notes?: string
// }

// export interface I_CheckInRequest {
//     shiftId: T_ObjectId
//     timestamp?: T_Timestamp
//     location?: {
//         latitude: number
//         longitude: number
//     }
//     notes?: string
// }

// export interface I_CheckOutRequest {
//     shiftId: T_ObjectId
//     timestamp?: T_Timestamp
//     location?: {
//         latitude: number
//         longitude: number
//     }
//     notes?: string
// }

// export interface I_ListShiftsRequest {
//     companyId: T_ObjectId
//     employeeId?: T_ObjectId
//     date?: T_Timestamp
//     startDate?: T_Timestamp
//     endDate?: T_Timestamp
//     status?: string
//     limit?: number
//     offset?: number
// }

// export interface I_GetShiftScheduleRequest {
//     companyId: T_ObjectId
//     date: T_Timestamp
//     includeDetails?: boolean
// }

// // ============================================================================
// // MENU REQUESTS
// // ============================================================================

// export interface I_CreateMenuItemRequest {
//     companyId: T_ObjectId
//     name: string
//     description?: string
//     price: number
//     category: string
//     image?: string
//     ingredients?: string[]
//     allergens?: string[]
//     preparationTime?: number // minutes
//     nutritionalInfo?: {
//         calories: number
//         protein: number
//         carbs: number
//         fat: number
//         fiber?: number
//         sugar?: number
//     }
//     dietary?: {
//         vegetarian?: boolean
//         vegan?: boolean
//         glutenFree?: boolean
//         dairyFree?: boolean
//     }
// }

// export interface I_UpdateMenuItemRequest {
//     id: T_ObjectId
//     name?: string
//     description?: string
//     price?: number
//     category?: string
//     image?: string
//     availability?: boolean
//     ingredients?: string[]
//     allergens?: string[]
//     preparationTime?: number
//     nutritionalInfo?: Record<string, number>
// }

// export interface I_DeleteMenuItemRequest {
//     id: T_ObjectId
//     archiveOnly?: boolean
// }

// export interface I_ListMenuRequest {
//     companyId: T_ObjectId
//     category?: string
//     available?: boolean
//     limit?: number
//     offset?: number
// }

// export interface I_CreateMenuCategoryRequest {
//     companyId: T_ObjectId
//     name: string
//     description?: string
//     displayOrder?: number
// }

// // ============================================================================
// // SALES REQUESTS
// // ============================================================================

// export interface I_CreateSalesTransactionRequest {
//     companyId: T_ObjectId
//     items: Array<{
//         menuItemId: T_ObjectId
//         quantity: number
//         unitPrice: number
//         specialInstructions?: string
//         modifiers?: Array<{
//             name: string
//             price: number
//         }>
//     }>
//     subtotal: number
//     tax: number
//     discount?: number
//     discountReason?: string
//     total: number
//     paymentMethod: 'cash' | 'card' | 'mobile' | 'check'
//     customerId?: T_ObjectId
//     employeeId: T_ObjectId
//     notes?: string
// }

// export interface I_RefundTransactionRequest {
//     transactionId: T_ObjectId
//     amount: number
//     reason: string
//     refundMethod?: string
// }

// export interface I_GetSalesReportRequest {
//     companyId: T_ObjectId
//     startDate: T_Timestamp
//     endDate: T_Timestamp
//     groupBy?: 'day' | 'week' | 'month' | 'payment_method' | 'employee'
//     includeBreakdown?: boolean
// }

// export interface I_ListSalesRequest {
//     companyId: T_ObjectId
//     startDate?: T_Timestamp
//     endDate?: T_Timestamp
//     employeeId?: T_ObjectId
//     paymentMethod?: string
//     limit?: number
//     offset?: number
// }

// // ============================================================================
// // INVENTORY REQUESTS
// // ============================================================================

// export interface I_CreateInventoryItemRequest {
//     companyId: T_ObjectId
//     sku: string
//     name: string
//     description?: string
//     category: string
//     quantity: number
//     unit: 'piece' | 'kg' | 'l' | 'g' | 'oz' | 'lb' | 'ml' | 'gal'
//     minimumQuantity: number
//     maximumQuantity: number
//     unitCost: number
//     supplierId?: T_ObjectId
//     storage: {
//         location: string
//         bin?: string
//     }
// }

// export interface I_UpdateInventoryItemRequest {
//     id: T_ObjectId
//     name?: string
//     description?: string
//     category?: string
//     minimumQuantity?: number
//     maximumQuantity?: number
//     unitCost?: number
//     status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
// }

// export interface I_AdjustInventoryRequest {
//     inventoryItemId: T_ObjectId
//     quantity: number
//     type:
//         | 'purchase'
//         | 'sale'
//         | 'adjustment'
//         | 'waste'
//         | 'return'
//         | 'damage'
//         | 'spoilage'
//     reason?: string
//     notes?: string
// }

// export interface I_CountInventoryRequest {
//     companyId: T_ObjectId
//     items: Array<{
//         inventoryItemId: T_ObjectId
//         countedQuantity: number
//         unit: string
//         notes?: string
//     }>
//     countDate: T_Timestamp
//     countedBy: T_ObjectId
// }

// export interface I_ListInventoryRequest {
//     companyId: T_ObjectId
//     category?: string
//     status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
//     search?: string
//     limit?: number
//     offset?: number
// }

// export interface I_GetInventoryReportRequest {
//     companyId: T_ObjectId
//     startDate: T_Timestamp
//     endDate: T_Timestamp
//     includeVariances?: boolean
// }

// // ============================================================================
// // SUPPLIER REQUESTS
// // ============================================================================

// export interface I_CreateSupplierRequest {
//     companyId: T_ObjectId
//     name: string
//     email: string
//     phone: string
//     website?: string
//     address?: {
//         street: string
//         city: string
//         state: string
//         zip: string
//         country: string
//     }
//     paymentTerms: string
// }

// export interface I_UpdateSupplierRequest {
//     id: T_ObjectId
//     name?: string
//     email?: string
//     phone?: string
//     website?: string
//     paymentTerms?: string
//     status?: 'active' | 'inactive' | 'blocked'
// }

// export interface I_ListSuppliersRequest {
//     companyId: T_ObjectId
//     status?: 'active' | 'inactive' | 'blocked'
//     limit?: number
//     offset?: number
// }

// // ============================================================================
// // PURCHASE ORDER REQUESTS
// // ============================================================================

// export interface I_CreatePurchaseOrderRequest {
//     companyId: T_ObjectId
//     supplierId: T_ObjectId
//     items: Array<{
//         inventoryItemId: T_ObjectId
//         quantity: number
//         unit: string
//         unitPrice: number
//     }>
//     notes?: string
//     deliveryDate?: T_Timestamp
// }

// export interface I_UpdatePurchaseOrderRequest {
//     id: T_ObjectId
//     status?:
//         | 'draft'
//         | 'sent'
//         | 'confirmed'
//         | 'partially_received'
//         | 'received'
//         | 'cancelled'
//         | 'closed'
//     deliveryDate?: T_Timestamp
//     notes?: string
// }

// export interface I_ReceiveStockRequest {
//     purchaseOrderId: T_ObjectId
//     items: Array<{
//         inventoryItemId: T_ObjectId
//         quantityReceived: number
//         unit: string
//         condition?: 'good' | 'damaged' | 'incorrect'
//         notes?: string
//     }>
//     receivedDate?: T_Timestamp
//     receivedBy?: T_ObjectId
// }

// export interface I_ListPurchaseOrdersRequest {
//     companyId: T_ObjectId
//     supplierId?: T_ObjectId
//     status?: string
//     startDate?: T_Timestamp
//     endDate?: T_Timestamp
//     limit?: number
//     offset?: number
// }

// // ============================================================================
// // RESPONSES
// // ============================================================================

// export interface I_EmployeeResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_EmployeeListResponse {
//     success: boolean
//     data: any[]
//     pagination: {
//         total: number
//         limit: number
//         offset: number
//         hasMore: boolean
//     }
//     timestamp: string
//     requestId: string
// }

// export interface I_ShiftResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_MenuResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_MenuListResponse {
//     success: boolean
//     data: any[]
//     pagination: {
//         total: number
//         limit: number
//         offset: number
//         hasMore: boolean
//     }
//     timestamp: string
//     requestId: string
// }

// export interface I_SalesResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_SalesReportResponse {
//     success: boolean
//     data?: {
//         period: { startDate: T_Timestamp; endDate: T_Timestamp }
//         totalTransactions: number
//         totalRevenue: number
//         breakdown: Record<string, any>
//     }
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_InventoryResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_InventoryListResponse {
//     success: boolean
//     data: any[]
//     pagination: {
//         total: number
//         limit: number
//         offset: number
//         hasMore: boolean
//     }
//     timestamp: string
//     requestId: string
// }

// export interface I_InventoryReportResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_SupplierResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }

// export interface I_PurchaseOrderResponse {
//     success: boolean
//     data?: any
//     error?: { code: string; message: string }
//     timestamp: string
//     requestId: string
// }
