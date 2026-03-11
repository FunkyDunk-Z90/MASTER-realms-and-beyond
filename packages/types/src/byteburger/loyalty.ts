// All loyalty types are derived from Zod schemas in @rnb/validators.

export type {
    T_TierLevel,
    T_LoyaltyAccount,
    T_Achievement,
    T_Reward,
    T_PointsTransaction,
} from '@rnb/validators'

import type { T_TierLevel, T_LoyaltyAccount, T_Achievement, T_Reward, T_PointsTransaction } from '@rnb/validators'

export type I_LoyaltyAccount = T_LoyaltyAccount
export type I_Achievement = T_Achievement
export type I_Reward = T_Reward
export type I_PointsTransaction = T_PointsTransaction
export type E_TierLevel = T_TierLevel

// ─── Tier Benefits (runtime data, kept here) ──────────────────────────────────

export const TIER_BENEFITS: Record<
    T_TierLevel,
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
        benefits: ['1.25x points', 'Free item on birthday', 'Early access to promos'],
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
