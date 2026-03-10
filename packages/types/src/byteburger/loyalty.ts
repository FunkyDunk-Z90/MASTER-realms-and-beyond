/**
 * @rnb/types - Byte Burger Loyalty Program Types
 * Points, rewards, achievements, and gamification
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export type E_TierLevel = 'basic' | 'silver' | 'gold' | 'platinum' | 'retro_legend'

export interface I_LoyaltyAccount {
    id: T_ObjectId
    customerId: T_ObjectId
    points: number
    totalPointsEarned: number
    totalPointsRedeemed: number
    tier: E_TierLevel
    joinDate: T_Timestamp
    lastPointsEarned?: T_Timestamp
    nextTierAt?: number
}

export interface I_Achievement {
    id: string
    name: string
    description: string
    icon: string
    unlockedAt?: T_Timestamp
    progress?: number
    maxProgress?: number
}

export interface I_Reward {
    id: T_ObjectId
    name: string
    description: string
    pointsCost: number
    discount?: number
    freeItem?: T_ObjectId
    expiresAt?: Date
}

export interface I_LoyaltyRedeemRequest {
    rewardId: T_ObjectId
}

export interface I_PointsTransaction {
    id: T_ObjectId
    customerId: T_ObjectId
    amount: number
    type: 'earn' | 'redeem' | 'adjust' | 'bonus'
    description: string
    relatedOrderId?: T_ObjectId
    timestamp: T_Timestamp
}

export interface I_GamificationData {
    customerId: T_ObjectId
    level: number
    experience: number
    achievements: I_Achievement[]
    badges: Array<{
        id: string
        name: string
        unlockedAt: T_Timestamp
    }>
    streakDays: number
    lastGamePlayDate?: T_Timestamp
}

export const TIER_BENEFITS: Record<
    E_TierLevel,
    {
        minPoints: number
        pointsMultiplier: number
        benefits: string[]
    }
> = {
    basic: {
        minPoints: 0,
        pointsMultiplier: 1,
        benefits: ['Basic points earning', 'Birthday bonus'],
    },
    silver: {
        minPoints: 500,
        pointsMultiplier: 1.25,
        benefits: [
            '1.25x points',
            'Free item on birthday',
            'Early access to promos',
        ],
    },
    gold: {
        minPoints: 2000,
        pointsMultiplier: 1.5,
        benefits: ['1.5x points', 'Monthly bonus', 'Priority delivery'],
    },
    platinum: {
        minPoints: 5000,
        pointsMultiplier: 2,
        benefits: ['2x points', 'Exclusive items', 'VIP support'],
    },
    retro_legend: {
        minPoints: 10000,
        pointsMultiplier: 2.5,
        benefits: ['2.5x points', 'Lifetime rewards', 'Retro legend status'],
    },
}
