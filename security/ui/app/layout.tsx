import type { Metadata } from 'next'
import { ThemeInitializer, ThemeProvider } from '@rnb/ui'

import '@rnb/styles'
// import './globals.scss'

const THEME_KEY = 'rnb-auth-theme'
const MODE_KEY = 'rnb-auth-mode'

export const metadata: Metadata = {
    title: 'Realms & Beyond — Account',
    description: 'Manage your Realms & Beyond identity.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeInitializer
                    themeStorageKey={THEME_KEY}
                    modeStorageKey={MODE_KEY}
                    defaultTheme="global-theme"
                />
            </head>
            <body className="app-wrapper">
                <ThemeProvider
                    themeStorageKey={THEME_KEY}
                    modeStorageKey={MODE_KEY}
                    defaultTheme="global-theme"
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
