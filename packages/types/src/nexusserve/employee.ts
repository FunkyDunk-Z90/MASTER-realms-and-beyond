// All employee types are derived from Zod schemas in @rnb/validators.

export type {
    T_EmployeeRole,
    T_EmployeeStatus,
    T_Employee,
    T_CreateEmployeeRequest,
    T_UpdateEmployeeRequest,
} from '@rnb/validators'

import type {
    T_EmployeeRole,
    T_EmployeeStatus,
    T_Employee,
    T_CreateEmployeeRequest,
    T_UpdateEmployeeRequest,
} from '@rnb/validators'

export type E_EmployeeRole = T_EmployeeRole
export type E_EmployeeStatus = T_EmployeeStatus
export type I_Employee = T_Employee
export type I_CreateEmployeeRequest = T_CreateEmployeeRequest
export type I_UpdateEmployeeRequest = T_UpdateEmployeeRequest
