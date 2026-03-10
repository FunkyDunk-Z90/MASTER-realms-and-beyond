import { Sidebar } from '@rnb/ui'
import { docsSections } from './(data)/navLinks'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="docs-shell">
            <Sidebar sections={docsSections} defaultOpen storageKey="rnb-codex-sidebar" />
            <div className="docs-main">{children}</div>
        </div>
    )
}
