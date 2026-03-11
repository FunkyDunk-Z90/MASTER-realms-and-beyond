'use client'

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_ThemeName = 'global-theme' | 'monochrome' | 'n64'

export type T_ThemeMode = 'light' | 'dark' | 'system'

export interface I_ThemeContextValue {
    theme: T_ThemeName
    mode: T_ThemeMode
    setTheme: (theme: T_ThemeName) => void
    setMode: (mode: T_ThemeMode) => void
    isDark: boolean
}

const VALID_THEMES: T_ThemeName[] = ['global-theme', 'monochrome', 'n64']

const VALID_MODES: T_ThemeMode[] = ['light', 'dark', 'system']

const ThemeContext = createContext<I_ThemeContextValue | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface I_ThemeProviderProps {
    children: ReactNode
    /** localStorage key for the active theme. @default 'rnb-theme' */
    themeStorageKey?: string
    /** localStorage key for the active mode. @default 'rnb-mode' */
    modeStorageKey?: string
    /** Theme applied before localStorage is read. @default 'arcade' */
    defaultTheme?: T_ThemeName
    /** Mode applied before localStorage is read. @default 'system' */
    defaultMode?: T_ThemeMode
}

export const ThemeProvider: React.FC<I_ThemeProviderProps> = ({
    children,
    themeStorageKey = 'rnb-theme',
    modeStorageKey = 'rnb-mode',
    defaultTheme = 'global-theme',
    defaultMode = 'system',
}) => {
    const [theme, setThemeState] = useState<T_ThemeName>(defaultTheme)
    const [mode, setModeState] = useState<T_ThemeMode>(defaultMode)
    const [mounted, setMounted] = useState(false)

    const isDark =
        mode === 'dark' ||
        (mode === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)

    useEffect(() => {
        const savedTheme = localStorage.getItem(
            themeStorageKey
        ) as T_ThemeName | null
        const savedMode = localStorage.getItem(
            modeStorageKey
        ) as T_ThemeMode | null

        if (savedTheme && VALID_THEMES.includes(savedTheme)) {
            setThemeState(savedTheme)
        }
        if (savedMode && VALID_MODES.includes(savedMode)) {
            setModeState(savedMode)
        }

        setMounted(true)
    }, [themeStorageKey, modeStorageKey])

    useEffect(() => {
        if (!mounted) return

        const html = document.documentElement
        html.setAttribute('data-theme', theme)

        if (mode !== 'system') {
            html.setAttribute('data-mode', mode)
        } else {
            html.removeAttribute('data-mode')
        }

        localStorage.setItem(themeStorageKey, theme)
        localStorage.setItem(modeStorageKey, mode)
    }, [theme, mode, mounted, themeStorageKey, modeStorageKey])

    useEffect(() => {
        if (mode !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => setModeState('system')
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [mode])

    const setTheme = (newTheme: T_ThemeName) => setThemeState(newTheme)
    const setMode = (newMode: T_ThemeMode) => setModeState(newMode)

    return (
        <ThemeContext.Provider
            value={{ theme, mode, setTheme, setMode, isDark }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTheme = (): I_ThemeContextValue => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
