import type { Metadata } from 'next'
import { ThemeProvider, ThemeInitializer, AuthProvider } from '@rnb/ui'

import '@rnb/styles'

const THEME_KEY = 'aether-theme'
const MODE_KEY = 'aether-mode'

export const metadata: Metadata = {
    title: 'Aetherscribe',
    description: 'Chronicle your worlds. Begin your legend.',
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
                />
            </head>
            <body className="app-wrapper">
                <ThemeProvider
                    themeStorageKey={THEME_KEY}
                    modeStorageKey={MODE_KEY}
                >
                    <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
