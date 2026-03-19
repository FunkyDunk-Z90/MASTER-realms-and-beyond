'use client'

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'

// ─── API base URLs ─────────────────────────────────────────────────────────────
// Override via env vars in .env.local

const rnbApiBase = (): string => {
    const root =
        typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL
            : 'http://localhost:2611'
    return `${root}/api/v1/user`
}

const aetherscribeApiBase = (): string => {
    const root =
        typeof process !== 'undefined' &&
        process.env?.NEXT_PUBLIC_AETHERSCRIBE_API_URL
            ? process.env.NEXT_PUBLIC_AETHERSCRIBE_API_URL
            : 'http://localhost:8811'
    return `${root}/api/v1/account`
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface I_Venture {
    ventureName: string
    ventureId: string
    linkedAt: string
    scopes: string[]
    status: string
    thirdParty?: boolean
}

export interface I_AuthUser {
    id: string
    profile: {
        firstName: string
        lastName: string
        email: string
        dateOfBirth?: string
        nationality?: string
        gender?: string
        pronouns?: string
    }
    preferences?: {
        language: string
        timezone: string
        theme: string
    }
    verification?: {
        emailVerified: boolean
        phoneVerified: boolean
        identityVerified: boolean
        twoFactorEnabled: boolean
    }
    lifecycle?: {
        status: string
    }
    ventures?: I_Venture[]
}

interface I_SignupData {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
}

interface I_AuthContextValue {
    user: I_AuthUser | null
    isLoading: boolean
    hasAetherscribeAccount: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    signup: (data: I_SignupData) => Promise<void>
    createAetherscribeAccount: (username: string, plan: string) => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<I_AuthContextValue | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<I_AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Rehydrate session from the httpOnly cookie on every mount
    useEffect(() => {
        fetch(`${rnbApiBase()}/me`, { credentials: 'include' })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setUser(data?.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false))
    }, [])

    const hasAetherscribeAccount = Boolean(
        user?.ventures?.some((v) => v.ventureName === 'aetherscribe')
    )

    const login = async (email: string, password: string): Promise<void> => {
        const res = await fetch(`${rnbApiBase()}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message ?? 'Login failed.')
        setUser(data.user)
    }

    const logout = async (): Promise<void> => {
        await fetch(`${rnbApiBase()}/logout`, {
            method: 'POST',
            credentials: 'include',
        })
        setUser(null)
    }

    const signup = async (data: I_SignupData): Promise<void> => {
        const res = await fetch(`${rnbApiBase()}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message ?? 'Sign up failed.')
        setUser(json.user)
    }

    const createAetherscribeAccount = async (
        username: string,
        plan: string
    ): Promise<void> => {
        const res = await fetch(aetherscribeApiBase(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, plan }),
        })
        const json = await res.json()
        if (!res.ok)
            throw new Error(
                json.message ?? 'Failed to create Aetherscribe account.'
            )
        // Response includes updated user (with ventures array populated)
        setUser(json.user)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                hasAetherscribeAccount,
                login,
                logout,
                signup,
                createAetherscribeAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): I_AuthContextValue => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
