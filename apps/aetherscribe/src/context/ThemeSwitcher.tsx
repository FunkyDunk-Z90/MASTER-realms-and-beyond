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
            id: 'teal',
            label: 'Teal',
            value: 'teal',
            description: 'Deep teal with amber accent',
        },
        {
            id: 'aether',
            label: 'Aether',
            value: 'aether',
            description: 'Amethyst with rose-gold accent',
        },
        {
            id: 'sovereign',
            label: 'Sovereign',
            value: 'sovereign',
            description: 'Crimson with pale-gold accent',
        },
        {
            id: 'acanthium',
            label: 'Acanthium',
            value: 'acanthium',
            description: 'Emerald with copper accent',
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
            ['teal', 'aether', 'sovereign', 'acanthium'].includes(value)
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
