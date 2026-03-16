'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from 'react'
import { codexApi } from '@/src/api/aetherscribeApi'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface I_CodexItem {
    id: string
    accountId: string
    name: string
    description?: string
    coverImageUrl?: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

interface I_CodexLimits {
    maxCodices: number | null
}

interface I_CodexContext {
    codices: I_CodexItem[]
    activeCodex: I_CodexItem | null
    limits: I_CodexLimits
    isLoading: boolean
    error: string | null
    setActiveCodex: (codex: I_CodexItem) => void
    createCodex: (name: string, description?: string) => Promise<void>
    deleteCodex: (id: string) => Promise<void>
    refreshCodex: () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CodexContext = createContext<I_CodexContext | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CodexProvider({ children }: { children: ReactNode }) {
    const [codices, setCodices] = useState<I_CodexItem[]>([])
    const [activeCodex, setActiveCodexState] = useState<I_CodexItem | null>(null)
    const [limits, setLimits] = useState<I_CodexLimits>({ maxCodices: null })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refreshCodex = useCallback(async () => {
        try {
            setError(null)
            const { codices: list, limits: incoming } = await codexApi.list() as any
            const typed = list as I_CodexItem[]
            setCodices(typed)
            setLimits({ maxCodices: incoming?.maxCodices ?? null })

            // Restore previously selected or use the default
            const storedId =
                typeof window !== 'undefined'
                    ? localStorage.getItem('activeCodexId')
                    : null
            const preferred =
                typed.find((c) => c.id === storedId) ??
                typed.find((c) => c.isDefault) ??
                typed[0] ??
                null
            setActiveCodexState(preferred)
        } catch (err: any) {
            setError(err.message ?? 'Failed to load codices.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshCodex()
    }, [refreshCodex])

    const setActiveCodex = useCallback((codex: I_CodexItem) => {
        setActiveCodexState(codex)
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeCodexId', codex.id)
        }
    }, [])

    const createCodex = useCallback(
        async (name: string, description?: string) => {
            const { codex } = await codexApi.create({ name, description })
            await refreshCodex()
            setActiveCodex(codex as I_CodexItem)
        },
        [refreshCodex, setActiveCodex]
    )

    const deleteCodex = useCallback(
        async (id: string) => {
            await codexApi.delete(id)
            await refreshCodex()
        },
        [refreshCodex]
    )

    return (
        <CodexContext.Provider
            value={{
                codices,
                activeCodex,
                limits,
                isLoading,
                error,
                setActiveCodex,
                createCodex,
                deleteCodex,
                refreshCodex,
            }}
        >
            {children}
        </CodexContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCodex(): I_CodexContext {
    const ctx = useContext(CodexContext)
    if (!ctx) throw new Error('useCodex must be used inside <CodexProvider>')
    return ctx
}
