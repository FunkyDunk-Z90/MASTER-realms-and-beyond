import { Request, Response } from 'express'
import { I_IdentityProfile, I_ContactProps } from '@rnb/types'
import { IdentityModel } from '../models/identityModel'
import { buildIdentityDefaults } from '../utils/buildIdentityDefaults'
import { AppError } from '@rnb/errors'
import { catchAsync } from '@rnb/middleware'
import { validate } from '@rnb/validators'
import { setAuthCookie, formatEmail } from '@rnb/security'
import { env } from '../config/validateEnv'

interface I_SuccessResponse {
    accessToken: void
    user: ReturnType<InstanceType<typeof IdentityModel>['getPublicInfo']>
}

interface I_ErrorResponse {
    message: string
    field?: string
}

interface I_SignupBody {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
    dateOfBirth?: string
    nationality?: string
}

export const signup = catchAsync(
    async (
        req: Request<{}, I_SuccessResponse | I_ErrorResponse, I_SignupBody>,
        res: Response<I_SuccessResponse | I_ErrorResponse>
    ): Promise<void> => {
        const {
            firstName,
            lastName,
            email,
            password,
            passwordConfirm,
            dateOfBirth,
            nationality,
        } = req.body

        const normalizedEmail = formatEmail(email)

        validate({ field: 'firstName', firstName, lastName })
        validate({ field: 'email', value: normalizedEmail })
        validate({ field: 'passwordWithConfirm', password, passwordConfirm })

        const existingIdentity = await IdentityModel.findOne({
            'contact.email': normalizedEmail,
        }).lean()

        if (existingIdentity) {
            throw new AppError(
                'An account with this email already exists',
                409,
                'email'
            )
        }

        const profile: I_IdentityProfile = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            ...(dateOfBirth && { dateOfBirth }),
            ...(nationality && { nationality }),
        }

        const contact: I_ContactProps = { email: normalizedEmail }

        const identity = new IdentityModel(
            buildIdentityDefaults({ profile, contact, password, req })
        )

        identity.passwordConfirm = passwordConfirm
        await identity.save()

        const accessToken = setAuthCookie(
            res,
            identity._id.toString(),
            env.JWT_SECRET
        )

        res.status(201).json({
            accessToken,
            user: identity.getPublicInfo(),
        })
    }
)

interface I_LoginBody {
    email: string
    password: string
}

export const login = catchAsync(
    async (
        req: Request<{}, I_SuccessResponse | I_ErrorResponse, I_LoginBody>,
        res: Response<I_SuccessResponse | I_ErrorResponse>
    ): Promise<void> => {
        const { email, password } = req.body

        const normalizedEmail = formatEmail(email)

        const errorMessage = 'Invalid email or password'

        validate({ field: 'email', value: normalizedEmail })
        validate({ field: 'password', password })

        const identity = await IdentityModel.findOne({
            'contact.email': normalizedEmail,
        }).select('+security.passwordHash')

        if (!identity) {
            throw new AppError('Invalid email or password', 401)
        }

        const isPasswordCorrect = await identity.correctPassword(password)

        if (!isPasswordCorrect) {
            throw new AppError('Invalid email or password', 401)
        }

        identity.lastLoginAt = new Date()
        await identity.save({ validateModifiedOnly: true })

        const accessToken = setAuthCookie(
            res,
            identity._id.toString(),
            env.JWT_SECRET
        )

        res.status(200).json({
            accessToken,
            user: identity.getPublicInfo(),
        })
    }
)
