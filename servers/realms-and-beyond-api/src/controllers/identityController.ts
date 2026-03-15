import { Request, Response } from 'express'
import { Identity } from '@rnb/database'
import { AppError } from '@rnb/errors'
import { catchAsync } from '@rnb/middleware'
import { setAuthCookie, clearCookie, formatEmail } from '@rnb/security'
import { env, Z_SetPassword } from '@rnb/validators'
import { buildIdentityDefaults } from '../utils/buildIdentityDefaults'

const IS_DEV = env.NODE_ENV === 'development'

// ─── Shared Response Types ────────────────────────────────────────────────────

interface I_UserResponse {
    user: Record<string, unknown>
}

interface I_MessageResponse {
    message: string
}

interface I_ErrorResponse {
    message: string
    field?: string
}

// ─── Signup ───────────────────────────────────────────────────────────────────

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
        req: Request<{}, I_UserResponse | I_ErrorResponse, I_SignupBody>,
        res: Response<I_UserResponse | I_ErrorResponse>
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

        // ── Validate ──────────────────────────────────────────────────────────

        if (!firstName?.trim() || !lastName?.trim()) {
            throw new AppError(
                'First name and last name are required.',
                400,
                'name'
            )
        }

        if (password !== passwordConfirm) {
            throw new AppError(
                'Passwords do not match.',
                400,
                'passwordConfirm'
            )
        }

        const passwordCheck = Z_SetPassword.safeParse({ plaintext: password })
        if (!passwordCheck.success) {
            const message =
                passwordCheck.error.issues[0]?.message ?? 'Invalid password.'
            throw new AppError(message, 400, 'password')
        }

        const normalizedEmail = formatEmail(email)

        // ── Duplicate check ───────────────────────────────────────────────────

        const existing = await Identity.findByEmail(normalizedEmail)
        if (existing) {
            throw new AppError(
                'An account with this email already exists.',
                409,
                'email'
            )
        }

        // ── Create ────────────────────────────────────────────────────────────

        const identity = new Identity(
            buildIdentityDefaults({
                profile: {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: normalizedEmail,
                    ...(dateOfBirth && { dateOfBirth }),
                    ...(nationality && { nationality }),
                },
                req,
            })
        )

        // Validates, hashes, and saves the document
        await identity.setPassword({ plaintext: password })

        setAuthCookie(res, identity._id.toString(), env.JWT_SECRET, IS_DEV)

        res.status(201).json({ user: identity.toClient() })
    }
)

// ─── Login ────────────────────────────────────────────────────────────────────

interface I_LoginBody {
    email: string
    password: string
}

export const login = catchAsync(
    async (
        req: Request<{}, I_UserResponse | I_ErrorResponse, I_LoginBody>,
        res: Response<I_UserResponse | I_ErrorResponse>
    ): Promise<void> => {
        const { email, password } = req.body

        if (!email || !password) {
            throw new AppError('Email and password are required.', 400)
        }

        const identity = await Identity.findByEmail(formatEmail(email))

        // Vague error — don't leak whether the email exists
        if (!identity) {
            throw new AppError('Invalid email or password.', 401)
        }

        const isValid = await identity.verifyPassword({ plaintext: password })
        if (!isValid) {
            throw new AppError('Invalid email or password.', 401)
        }

        // Normalize IP: strip IPv6-mapped IPv4 prefix (::ffff:x.x.x.x → x.x.x.x)
        const rawIp = req.ip ?? req.socket.remoteAddress ?? '0.0.0.0'
        const ip = rawIp.startsWith('::ffff:') ? rawIp.slice(7) : rawIp
        await identity.recordLogin({ ip })

        setAuthCookie(res, identity._id.toString(), env.JWT_SECRET, IS_DEV)

        res.status(200).json({ user: identity.toClient() })
    }
)

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = catchAsync(
    async (req: Request, res: Response<I_MessageResponse>): Promise<void> => {
        clearCookie(res, IS_DEV)
        res.status(200).json({ message: 'Logged out successfully.' })
    }
)

// ─── Check Auth ───────────────────────────────────────────────────────────────
// Lightweight ping — returns whether the session is valid and who owns it.
// Use GET /me for the full profile.

export const checkAuth = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({
            authenticated: true,
            userId: req.identity!._id.toString(),
        })
    }
)

// ─── Get My Account ───────────────────────────────────────────────────────────

export const getMyAccount = catchAsync(
    async (req: Request, res: Response<I_UserResponse>): Promise<void> => {
        res.status(200).json({ user: req.identity!.toClient() })
    }
)

// ─── Update My Account ────────────────────────────────────────────────────────

interface I_UpdateAccountBody {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    nationality?: string
    gender?: string
    pronouns?: string
    language?: string
    timezone?: string
    theme?: 'light' | 'dark' | 'system'
    currency?: string
    dateFormat?: string
}

export const updateMyAccount = catchAsync(
    async (
        req: Request<{}, I_UserResponse | I_ErrorResponse, I_UpdateAccountBody>,
        res: Response<I_UserResponse | I_ErrorResponse>
    ): Promise<void> => {
        const identity = req.identity!

        const {
            firstName,
            lastName,
            dateOfBirth,
            nationality,
            gender,
            pronouns,
            language,
            timezone,
            theme,
            currency,
            dateFormat,
        } = req.body

        // ── Profile fields ────────────────────────────────────────────────────

        if (firstName !== undefined) {
            if (!firstName.trim())
                throw new AppError(
                    'First name cannot be empty.',
                    400,
                    'firstName'
                )
            identity.profile.firstName = firstName.trim()
        }
        if (lastName !== undefined) {
            if (!lastName.trim())
                throw new AppError(
                    'Last name cannot be empty.',
                    400,
                    'lastName'
                )
            identity.profile.lastName = lastName.trim()
        }
        if (dateOfBirth !== undefined)
            identity.profile.dateOfBirth = dateOfBirth
        if (nationality !== undefined)
            identity.profile.nationality = nationality
        if (gender !== undefined) identity.profile.gender = gender
        if (pronouns !== undefined) identity.profile.pronouns = pronouns

        // ── Preference fields ─────────────────────────────────────────────────

        if (language !== undefined) identity.preferences.language = language
        if (timezone !== undefined) identity.preferences.timezone = timezone
        if (theme !== undefined) identity.preferences.theme = theme
        if (currency !== undefined) identity.preferences.currency = currency
        if (dateFormat !== undefined)
            identity.preferences.dateFormat = dateFormat

        await identity.save({ validateModifiedOnly: true })

        res.status(200).json({ user: identity.toClient() })
    }
)

// ─── Delete My Account ────────────────────────────────────────────────────────

export const deleteMyAccount = catchAsync(
    async (
        req: Request,
        res: Response<I_MessageResponse | I_ErrorResponse>
    ): Promise<void> => {
        const identity = req.identity!

        // Soft-delete with default 30-day recovery window
        await identity.softDelete()

        // Record GDPR deletion request in audit log
        await identity.requestDeletion()

        clearCookie(res, IS_DEV)

        res.status(200).json({
            message:
                'Your account has been scheduled for deletion. You have 30 days to recover it.',
        })
    }
)
