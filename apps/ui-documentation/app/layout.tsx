import type { Metadata } from 'next'
import { Header } from '@rnb/ui'
import '@rnb/styles'

export const metadata: Metadata = {
    title: 'Modularix',
    description: 'Realms & Beyond Ui',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="app-wrapper">{children}</body>
        </html>
    )
}
