import type { Metadata } from 'next'
import { Navbar, Footer, ThemeProvider, ThemeInitializer } from '@rnb/ui'
import { I_Link } from '@rnb/types'
import '@rnb/styles'

const THEME_KEY = 'rnb-codex-theme'
const MODE_KEY = 'rnb-codex-mode'
const APP_NAME = 'R&B Codex'

export const metadata: Metadata = {
    title: APP_NAME,
    description: 'Realms & Beyond — Monorepo Developer Documentation',
}

const navLinks: I_Link[] = [
    { id: 'getting-started', label: 'Getting Started', href: '/docs/getting-started' },
    { id: 'design-system',   label: 'Design System',   href: '/docs/design-system'   },
    { id: 'components',      label: 'Components',       href: '/docs/components'      },
    { id: 'packages',        label: 'Packages',         href: '/docs/packages'        },
    { id: 'contributing',    label: 'Contributing',     href: '/docs/contributing'    },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeInitializer themeStorageKey={THEME_KEY} modeStorageKey={MODE_KEY} />
            </head>
            <body className="app-wrapper">
                <ThemeProvider themeStorageKey={THEME_KEY} modeStorageKey={MODE_KEY}>
                    <Navbar headerTitle={APP_NAME} navItems={navLinks} />
                    <main className="page-wrapper">{children}</main>
                    <Footer appName={APP_NAME} />
                </ThemeProvider>
            </body>
        </html>
    )
}
