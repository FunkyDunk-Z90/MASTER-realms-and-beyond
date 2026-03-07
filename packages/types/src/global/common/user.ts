import { T_ObjectId, T_Timestamp } from './commonIndex'

export interface I_User {
    id: T_ObjectId
    email: string
    firstName: string
    lastName: string
    avatar?: string
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}
