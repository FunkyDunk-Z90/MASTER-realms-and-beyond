import type { Metadata } from 'next'
import { Header, Footer } from '@rnb/ui'
import '@rnb/styles'
import { I_Link } from '@rnb/types'

const appName = 'Modularix'

export const metadata: Metadata = {
    title: appName,
    description: 'Realms & Beyond Ui',
}

const navbarItems: I_Link[] = [
    {
        id: 'home',
        label: 'Home',
        href: '/',
    },
]

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="app-wrapper">
                <Header appName={appName} hasAuth navbarItems={navbarItems} />
                {children}
                <Footer appName={appName} />
            </body>
        </html>
    )
}
