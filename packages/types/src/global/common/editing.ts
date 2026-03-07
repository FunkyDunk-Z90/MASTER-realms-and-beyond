import { T_ObjectId, T_Timestamp } from './commonIndex'

export interface I_Note {
    id: T_ObjectId
    authorId: T_ObjectId
    content: string
    createdAt: T_Timestamp
    updatedAt?: T_Timestamp
    tags?: string[]
}

export interface I_Paras {
    id: string
    content: string
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
    order: number
}
