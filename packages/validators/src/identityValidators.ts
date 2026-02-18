import { AppError } from '@rnb/errors'

// ─── Field Union ──────────────────────────────────────────────────────────────

type T_IdentityField =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'password'
    | 'passwordWithConfirm'

// ─── Input Types ──────────────────────────────────────────────────────────────

interface I_NameInput {
    field: 'firstName' | 'lastName'
    firstName: string
    lastName: string
}

interface I_EmailInput {
    field: 'email'
    value: string
}

interface I_PasswordInput {
    field: 'password'
    password: string
}

interface I_PasswordWithConfirmInput {
    field: 'passwordWithConfirm'
    password: string
    passwordConfirm: string
}

type T_ValidateInput =
    | I_NameInput
    | I_EmailInput
    | I_PasswordInput
    | I_PasswordWithConfirmInput

// ─── Type Guards ──────────────────────────────────────────────────────────────

const isNameInput = (input: T_ValidateInput): input is I_NameInput =>
    input.field === 'firstName' || input.field === 'lastName'

const isEmailInput = (input: T_ValidateInput): input is I_EmailInput =>
    input.field === 'email'

const isPasswordInput = (input: T_ValidateInput): input is I_PasswordInput =>
    input.field === 'password'

const isPasswordWithConfirmInput = (
    input: T_ValidateInput
): input is I_PasswordWithConfirmInput => input.field === 'passwordWithConfirm'

// ─── Validation Logic ─────────────────────────────────────────────────────────

const validateName = (firstName: string, lastName: string): void => {
    if (!firstName?.trim() || !lastName?.trim()) {
        throw new AppError('First and last name are required', 400)
    }
}

const validateEmail = (value: string): void => {
    if (!value) {
        throw new AppError('Email is required', 400, 'email')
    }
}

const validatePassword = (password: string): void => {
    if (!password) {
        throw new AppError('Password is required', 400, 'password')
    }

    if (password.length < 9) {
        throw new AppError(
            'Password must be at least 9 characters',
            400,
            'password'
        )
    }

    if (!/[A-Z]/.test(password)) {
        throw new AppError(
            'Password must contain at least one uppercase letter',
            400,
            'password'
        )
    }

    if (!/[0-9]/.test(password)) {
        throw new AppError(
            'Password must contain at least one number',
            400,
            'password'
        )
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        throw new AppError(
            'Password must contain at least one special character',
            400,
            'password'
        )
    }
}

const validatePasswordWithConfirm = (
    password: string,
    passwordConfirm: string
): void => {
    validatePassword(password)

    if (!passwordConfirm) {
        throw new AppError(
            'Password confirmation is required',
            400,
            'passwordConfirm'
        )
    }

    if (password !== passwordConfirm) {
        throw new AppError('Passwords do not match', 400, 'passwordConfirm')
    }
}

// ─── Unified Validator ────────────────────────────────────────────────────────

export const validate = (input: T_ValidateInput): void => {
    if (isNameInput(input)) return validateName(input.firstName, input.lastName)
    if (isEmailInput(input)) return validateEmail(input.value)
    if (isPasswordInput(input)) return validatePassword(input.password)
    if (isPasswordWithConfirmInput(input))
        return validatePasswordWithConfirm(
            input.password,
            input.passwordConfirm
        )
}
