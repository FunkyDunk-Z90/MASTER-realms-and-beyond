/**
 * @rnb/types - NexusServe Shift Types
 * Employee shift scheduling and management
 */

import type { T_ObjectId, T_Timestamp } from '../global/common'

export enum E_ShiftStatus {
    SCHEDULED = 'scheduled',
    CHECKED_IN = 'checked_in',
    CHECKED_OUT = 'checked_out',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
}

export interface I_Shift {
    id: T_ObjectId
    companyId: T_ObjectId
    employeeId: T_ObjectId
    date: Date
    startTime: string
    endTime: string
    position: string
    breakDuration: number
    status: E_ShiftStatus
    actualCheckIn?: T_Timestamp
    actualCheckOut?: T_Timestamp
    notes?: string
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

export interface I_ShiftSchedule {
    companyId: T_ObjectId
    date: Date
    shifts: I_Shift[]
    totalHours: number
    employeesScheduled: number
}
