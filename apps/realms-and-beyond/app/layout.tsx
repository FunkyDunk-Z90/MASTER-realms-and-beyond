import type { Metadata } from 'next'
import { ThemeInitializer, ThemeProvider } from '@rnb/ui'

import '@rnb/styles'
import './globals.scss'

const THEME_KEY = 'rnb-theme'
const MODE_KEY = 'rnb-mode'

export const metadata: Metadata = {
    title: 'Realms & Beyond',
    description: 'A holding company building tools for adventure, hospitality, and creation.',
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
            <body>
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
