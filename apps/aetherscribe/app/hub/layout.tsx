import { Sidebar } from '@rnb/ui'
import { sidebarData } from '@/data/sidebarData'

export default function HubLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <section className="page-wrapper">
            <div className="asside-wrapper">
                <Sidebar sections={sidebarData} />
            </div>
            {children}
        </section>
    )
}
