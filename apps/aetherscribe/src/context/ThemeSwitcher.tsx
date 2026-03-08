'use client'

import React, { useEffect, useState } from 'react'
import { Dropdown, type I_DropdownOption } from '@rnb/ui'
import { useTheme, type T_ThemeName, type T_ThemeMode } from './ThemeContext'

interface I_ThemeSwitcherProps {
    /**
     * Allow users to switch theme color scheme
     * @default true
     */
    showThemePicker?: boolean

    /**
     * Allow users to switch between light/dark/system mode
     * @default true
     */
    showModePicker?: boolean
}

export const ThemeSwitcher: React.FC<I_ThemeSwitcherProps> = ({
    showThemePicker = true,
    showModePicker = true,
}) => {
    const { theme, mode, setTheme, setMode } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch flash on initial load
    // This ensures the button text shows the correct value from localStorage
    useEffect(() => {
        setMounted(true)
    }, [])

    const themeOptions: I_DropdownOption[] = [
        {
            id: 'arcade',
            label: 'Arcade',
            value: 'arcade',
            description: 'Warm amber glow with phosphor green accent',
        },
        {
            id: 'phosphor',
            label: 'Phosphor',
            value: 'phosphor',
            description: 'CRT terminal green with amber accent',
        },
        {
            id: 'sovereign',
            label: 'Sovereign',
            value: 'sovereign',
            description: 'Crimson authority with pale gold accent',
        },
        {
            id: 'void',
            label: 'Void',
            value: 'void',
            description: 'Teal sci-fi with violet accent',
        },
        {
            id: 'dusk',
            label: 'Dusk',
            value: 'dusk',
            description: 'Amethyst mystical with rose accent',
        },
        {
            id: 'parchment',
            label: 'Parchment',
            value: 'parchment',
            description: 'Ancient map light with terracotta accent',
        },
    ]

    const modeOptions: I_DropdownOption[] = [
        {
            id: 'light',
            label: 'Light',
            value: 'light',
        },
        {
            id: 'dark',
            label: 'Dark',
            value: 'dark',
        },
        {
            id: 'system',
            label: 'System',
            value: 'system',
        },
    ]

    const handleThemeChange = (value: string | undefined) => {
        if (
            value &&
            [
                'arcade',
                'phosphor',
                'sovereign',
                'void',
                'dusk',
                'parchment',
            ].includes(value)
        ) {
            setTheme(value as T_ThemeName)
        }
    }

    const handleModeChange = (value: string | undefined) => {
        if (value && ['light', 'dark', 'system'].includes(value)) {
            setMode(value as T_ThemeMode)
        }
    }

    // Suppress hydration warning since theme/mode from context might differ
    // from server render before localStorage is read
    return (
        <div className="theme-switcher" suppressHydrationWarning>
            {showThemePicker && (
                <div className="theme-switcher-item">
                    <label htmlFor="theme-picker">Theme</label>
                    <Dropdown
                        id="theme-picker"
                        options={themeOptions}
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
                        options={modeOptions}
                        selectedValue={mounted ? mode : undefined}
                        onChange={handleModeChange}
                        closeOnSelect
                    />
                </div>
            )}
        </div>
    )
}
