// All shift types are derived from Zod schemas in @rnb/validators.

export type {
    T_ShiftStatus,
    T_Shift,
    T_ShiftSchedule,
} from '@rnb/validators'

import type { T_ShiftStatus, T_Shift, T_ShiftSchedule } from '@rnb/validators'

export type E_ShiftStatus = T_ShiftStatus
export type I_Shift = T_Shift
export type I_ShiftSchedule = T_ShiftSchedule
