/**
 * @rnb/types - NexusServe Menu Types
 * Menu items and product catalog
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export interface I_MenuItem {
    id: T_ObjectId
    companyId: T_ObjectId
    name: string
    description?: string
    price: number
    category: string
    image?: string
    availability: boolean
    ingredients?: string[]
    allergens?: string[]
    nutritionalInfo?: {
        calories: number
        protein: number
        carbs: number
        fat: number
        fiber?: number
        sugar?: number
    }
    preparationTime?: number
    spiceLevel?: number
    vegetarian?: boolean
    vegan?: boolean
    glutenFree?: boolean
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

export interface I_CreateMenuItemRequest {
    name: string
    description?: string
    price: number
    category: string
    image?: string
    ingredients?: string[]
    allergens?: string[]
    nutritionalInfo?: {
        calories: number
        protein: number
        carbs: number
        fat: number
    }
    preparationTime?: number
}

export interface I_UpdateMenuItemRequest {
    name?: string
    description?: string
    price?: number
    category?: string
    image?: string
    availability?: boolean
    ingredients?: string[]
    allergens?: string[]
    nutritionalInfo?: Record<string, number>
}

export interface I_MenuCategory {
    id: T_ObjectId
    companyId: T_ObjectId
    name: string
    description?: string
    image?: string
    displayOrder: number
}

export interface I_MenuSection {
    categoryId: T_ObjectId
    items: I_MenuItem[]
}
