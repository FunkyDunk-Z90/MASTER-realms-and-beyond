// app/hub/layout.tsx
//
// Pure Server Component — no functions, no client-only imports.
// All search logic lives in HubSidebar (a Client Component) so nothing
// crosses the RSC → Client boundary illegally.

import { HubSidebar } from '@/components/HubSidebar'
import { sidebarData } from '@/data/sidebarSections'

export default function HubLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <HubSidebar sections={sidebarData} />
            <section className="section-wrapper">{children}</section>
        </>
    )
}
