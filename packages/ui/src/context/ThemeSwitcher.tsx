'use client'

import React, { useEffect, useState } from 'react'
import { Dropdown, type I_DropdownOption } from '../utils/Dropdown'
import { Button } from '../utils/Button'
import { useTheme, type T_ThemeName, type T_ThemeMode } from './ThemeContext'
import { Moon, Sun } from 'lucide-react'

export interface I_ThemeSwitcherProps {
    /** Show the theme colour picker. @default true */
    showThemePicker?: boolean
    /** Show the light / dark / system mode picker. @default true */
    showModePicker?: boolean
    showThemeToggle?: boolean
}

const THEME_OPTIONS: I_DropdownOption[] = [
    {
        id: 'global-theme',
        label: 'Global Theme',
        value: 'global-theme',
        description: 'Antique gold & sage — SNES RPG warmth',
    },
    {
        id: 'arcade',
        label: 'Arcade',
        value: 'arcade',
        description: 'Antique gold & sage — SNES RPG warmth',
    },
    {
        id: 'phosphor',
        label: 'Phosphor',
        value: 'phosphor',
        description: 'Forest green & leaf — Zelda / DKC palette',
    },
    {
        id: 'sovereign',
        label: 'Sovereign',
        value: 'sovereign',
        description: 'Battle crimson & pale gold — FFVI authority',
    },
    {
        id: 'void',
        label: 'Void',
        value: 'void',
        description: 'Cobalt steel & violet — N64 space odyssey',
    },
    {
        id: 'dusk',
        label: 'Dusk',
        value: 'dusk',
        description: 'Magic purple & rose flash — Chrono Trigger',
    },
    {
        id: 'parchment',
        label: 'Parchment',
        value: 'parchment',
        description: 'Aged paper & warm brown — SNES game manual',
    },
    {
        id: 'snes',
        label: 'SNES',
        value: 'snes',
        description:
            'Authentic 16-bit — pixel font, hard shadows, Press Start 2P',
    },
    {
        id: 'n64',
        label: 'N64',
        value: 'n64',
        description:
            'Console charcoal · logo gradient · A/B/C/Start button palette',
    },
]

const MODE_OPTIONS: I_DropdownOption[] = [
    { id: 'light', label: 'Light', value: 'light' },
    { id: 'dark', label: 'Dark', value: 'dark' },
    { id: 'system', label: 'System', value: 'system' },
]

const VALID_THEMES = THEME_OPTIONS.map((o) => o.value as T_ThemeName)
const VALID_MODES = MODE_OPTIONS.map((o) => o.value as T_ThemeMode)

export const ThemeSwitcher: React.FC<I_ThemeSwitcherProps> = ({
    showThemePicker = true,
    showModePicker = true,
    showThemeToggle = false,
}) => {
    const { theme, mode, setTheme, setMode } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleThemeChange = (value: string | undefined) => {
        if (value && VALID_THEMES.includes(value as T_ThemeName)) {
            setTheme(value as T_ThemeName)
        }
    }

    const handleModeChange = (value: string | undefined) => {
        if (value && VALID_MODES.includes(value as T_ThemeMode)) {
            setMode(value as T_ThemeMode)
        }
    }

    return (
        <div className="theme-switcher" suppressHydrationWarning>
            {showThemePicker && (
                <div className="theme-switcher-item">
                    <label htmlFor="theme-picker">Theme</label>
                    <Dropdown
                        id="theme-picker"
                        options={THEME_OPTIONS}
                        selectedValue={mounted ? theme : undefined}
                        onChange={handleThemeChange}
                        closeOnSelect
                    />
                </div>
            )}

            {showModePicker && (
                <div className="theme-switcher-item">
                    <label htmlFor="mode-picker">Mode</label>
                    <Dropdown
                        id="mode-picker"
                        options={MODE_OPTIONS}
                        selectedValue={mounted ? mode : undefined}
                        onChange={handleModeChange}
                        closeOnSelect
                    />
                </div>
            )}

            {showThemeToggle && (
                <div>
                    {mode === 'light' ? (
                        <Moon
                            className="theme-toggle"
                            onClick={() => setMode('dark')}
                        />
                    ) : (
                        <Sun
                            className="theme-toggle"
                            onClick={() => setMode('light')}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
