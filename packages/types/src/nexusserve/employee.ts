/**
 * @rnb/types - NexusServe Employee Types
 * Employee management and HR data
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export enum E_EmployeeRole {
    STAFF = 'staff',
    MANAGER = 'manager',
    ADMIN = 'admin',
}

export enum E_EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    TERMINATED = 'terminated',
    ON_LEAVE = 'on_leave',
}

export interface I_Employee {
    id: T_ObjectId
    companyId: T_ObjectId
    userId: T_ObjectId
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: E_EmployeeRole
    position: string
    department: string
    hireDate: Date
    status: E_EmployeeStatus
    wage: {
        hourly?: number
        salary?: number
        currency: string
    }
    emergencyContacts?: Array<{
        name: string
        relationship: string
        phone: string
    }>
    documents?: Array<{
        type: string
        url: string
        uploadedAt: T_Timestamp
    }>
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

export interface I_CreateEmployeeRequest {
    firstName: string
    lastName: string
    email: string
    phone?: string
    position: string
    department: string
    role: E_EmployeeRole
    hireDate?: Date
    wage: {
        hourly?: number
        salary?: number
        currency: string
    }
}

export interface I_UpdateEmployeeRequest {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    position?: string
    department?: string
    role?: E_EmployeeRole
    status?: E_EmployeeStatus
    wage?: {
        hourly?: number
        salary?: number
        currency: string
    }
}

export interface I_EmployeeStats {
    totalHours: number
    totalEarnings: number
    shiftsWorked: number
    averageRating?: number
    attendanceRate: number
}
