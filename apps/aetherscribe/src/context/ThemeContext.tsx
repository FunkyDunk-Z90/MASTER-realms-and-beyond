'use client'

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'

export type T_ThemeName = 'teal' | 'aether' | 'sovereign' | 'acanthium'
export type T_ThemeMode = 'light' | 'dark' | 'system'

interface I_ThemeContextValue {
    theme: T_ThemeName
    mode: T_ThemeMode
    setTheme: (theme: T_ThemeName) => void
    setMode: (mode: T_ThemeMode) => void
    isDark: boolean
}

const ThemeContext = createContext<I_ThemeContextValue | undefined>(undefined)

// Storage keys
const THEME_STORAGE_KEY = 'aether-theme'
const MODE_STORAGE_KEY = 'aether-mode'

// Defaults
const DEFAULT_THEME: T_ThemeName = 'teal'
const DEFAULT_MODE: T_ThemeMode = 'system'

interface I_ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: React.FC<I_ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<T_ThemeName>(DEFAULT_THEME)
    const [mode, setModeState] = useState<T_ThemeMode>(DEFAULT_MODE)
    const [mounted, setMounted] = useState(false)

    // Determine if currently in dark mode
    const isDark =
        mode === 'dark' ||
        (mode === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)

    // Initialize from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem(
            THEME_STORAGE_KEY
        ) as T_ThemeName | null
        const savedMode = localStorage.getItem(
            MODE_STORAGE_KEY
        ) as T_ThemeMode | null

        if (
            savedTheme &&
            ['teal', 'aether', 'sovereign', 'acanthium'].includes(savedTheme)
        ) {
            setThemeState(savedTheme)
        }

        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
            setModeState(savedMode)
        }

        setMounted(true)
    }, [])

    // Update HTML attributes when theme/mode changes
    useEffect(() => {
        if (!mounted) return

        const html = document.documentElement

        // CRITICAL FIX: Always set theme attribute, even for teal (the default)
        // This ensures the CSS selectors like html[data-theme='teal'] match
        // and allows users to select teal + light mode
        html.setAttribute('data-theme', theme)

        // Set mode
        if (mode !== 'system') {
            html.setAttribute('data-mode', mode)
        } else {
            html.removeAttribute('data-mode')
        }

        // Persist to storage
        localStorage.setItem(THEME_STORAGE_KEY, theme)
        localStorage.setItem(MODE_STORAGE_KEY, mode)
    }, [theme, mode, mounted])

    // Listen to system color scheme changes
    useEffect(() => {
        if (mode !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            // Force a re-render to update isDark
            setModeState('system')
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [mode])

    const setTheme = (newTheme: T_ThemeName) => {
        setThemeState(newTheme)
    }

    const setMode = (newMode: T_ThemeMode) => {
        setModeState(newMode)
    }

    const value: I_ThemeContextValue = {
        theme,
        mode,
        setTheme,
        setMode,
        isDark,
    }

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export const useTheme = (): I_ThemeContextValue => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
