import { Schema } from 'mongoose'
import { Z_SoftDelete, T_Identity } from '@rnb/validators'
import { daysFromNow } from '@rnb/middleware'
import { T_IdentityMethods } from '../_types'

const SOFT_DELETE_GRACE_DAYS = 30

export function registerLifecycleMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.softDelete = async function (input) {
        const { gracePeriodDays } = Z_SoftDelete.parse(
            input ?? { gracePeriodDays: SOFT_DELETE_GRACE_DAYS }
        )
        if (this.lifecycle.status === 'banned') {
            throw new Error('Banned accounts cannot be soft-deleted.')
        }
        this.lifecycle.status = 'soft-deleted'
        this.lifecycle.deletedAt = new Date().toISOString()
        this.lifecycle.recoverableUntil = daysFromNow(gracePeriodDays)
        await this.save()
    }

    schema.methods.restore = async function () {
        if (this.lifecycle.status === 'banned') {
            throw new Error('Banned accounts cannot be restored.')
        }
        if (this.lifecycle.status === 'active') {
            throw new Error('Account is already active.')
        }
        const { recoverableUntil } = this.lifecycle
        if (recoverableUntil && new Date(recoverableUntil) < new Date()) {
            throw new Error(
                'Recovery window has expired. Account cannot be restored.'
            )
        }
        this.lifecycle.status = 'active'
        this.lifecycle.deletedAt = undefined
        this.lifecycle.recoverableUntil = undefined
        await this.save()
    }

    schema.methods.ban = async function () {
        this.lifecycle.status = 'banned'
        this.lifecycle.deletedAt = new Date().toISOString()
        this.lifecycle.recoverableUntil = undefined
        await this.save()
    }

    schema.methods.isActive = function () {
        return this.lifecycle.status === 'active'
    }

    schema.methods.requestDeletion = async function () {
        if (this.lifecycle.status === 'banned') {
            throw new Error('Banned accounts cannot request deletion.')
        }
        this.audit.deletionRequestedAt = new Date().toISOString()
        await this.save()
    }
}
