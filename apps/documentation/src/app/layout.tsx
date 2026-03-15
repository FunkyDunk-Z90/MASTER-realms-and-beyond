import type { Metadata } from 'next'
import '@rnb/styles'
import '@rnb/styles/docs/devguide.scss'
import '@rnb/styles/docs/comp-showcase.scss'

export const metadata: Metadata = {
  title: 'Realms & Beyond — Developer Guide',
  description: 'Internal developer documentation for the Realms & Beyond monorepo platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="global-theme">
      <body>{children}</body>
    </html>
  )
}
