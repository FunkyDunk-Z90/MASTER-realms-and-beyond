import { I_SidebarSection } from '@rnb/ui'

export const docsSections: I_SidebarSection[] = [
    {
        title: 'Overview',
        items: [
            { id: 'intro', label: 'Introduction', href: '#intro' },
            {
                id: 'design-tokens',
                label: 'Design Tokens',
                href: '#design-tokens',
            },
            { id: 'css-vars', label: 'CSS Variables', href: '#css-vars' },
            { id: 'layout', label: 'Layout Classes', href: '#layout' },
        ],
    },
    {
        title: 'Components',
        items: [
            { id: 'button', label: 'Button', href: '#button' },
            { id: 'dropdown', label: 'Dropdown', href: '#dropdown' },
            { id: 'header', label: 'Header', href: '#header' },
            { id: 'navbar', label: 'Navbar', href: '#navbar' },
            { id: 'sidebar', label: 'Sidebar', href: '#sidebar' },
            { id: 'footer', label: 'Footer', href: '#footer' },
        ],
    },
    {
        title: 'Usage',
        items: [
            { id: 'monorepo', label: 'Monorepo Imports', href: '#monorepo' },
            { id: 'theme', label: 'Theming & Dark Mode', href: '#theme' },
            { id: 'types', label: 'Shared Types', href: '#types' },
        ],
    },
]
