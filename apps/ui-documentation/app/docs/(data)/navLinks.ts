import { I_SidebarSection } from '@rnb/ui'

export const docsSections: I_SidebarSection[] = [
    {
        title: 'Getting Started',
        items: [
            { id: 'gs-overview',   label: 'Overview',          href: '/docs/getting-started' },
            { id: 'gs-install',    label: 'Installation',       href: '/docs/getting-started#installation' },
            { id: 'gs-structure',  label: 'Project Structure',  href: '/docs/getting-started#structure' },
            { id: 'gs-commands',   label: 'Workspace Commands', href: '/docs/getting-started#commands' },
        ],
    },
    {
        title: 'Design System',
        items: [
            { id: 'ds-overview',    label: 'Overview',          href: '/docs/design-system' },
            { id: 'ds-tokens',      label: 'Design Tokens',     href: '/docs/design-system#tokens' },
            { id: 'ds-cssvars',     label: 'CSS Variables',     href: '/docs/design-system#css-vars' },
            { id: 'ds-themes',      label: 'Themes',            href: '/docs/design-system#themes' },
            { id: 'ds-typography',  label: 'Typography',        href: '/docs/design-system#typography' },
            { id: 'ds-scss',        label: 'SCSS Architecture', href: '/docs/design-system#scss' },
        ],
    },
    {
        title: 'UI Components',
        items: [
            { id: 'ui-overview',       label: 'Overview',        href: '/docs/components' },
            { id: 'ui-button',         label: 'Button',          href: '/docs/components#button' },
            { id: 'ui-dropdown',       label: 'Dropdown',        href: '/docs/components#dropdown' },
            { id: 'ui-navbar',         label: 'Navbar',          href: '/docs/components#navbar' },
            { id: 'ui-sidebar',        label: 'Sidebar',         href: '/docs/components#sidebar' },
            { id: 'ui-footer',         label: 'Footer',          href: '/docs/components#footer' },
            { id: 'ui-entitycard',     label: 'EntityCard',      href: '/docs/components#entitycard' },
            { id: 'ui-cartridgecard',  label: 'CartridgeCard',   href: '/docs/components#cartridgecard' },
            { id: 'ui-themeswitcher',  label: 'ThemeSwitcher',   href: '/docs/components#themeswitcher' },
            { id: 'ui-context',        label: 'Theme Context',   href: '/docs/components#theme-context' },
        ],
    },
    {
        title: 'Packages',
        items: [
            { id: 'pkg-types',       label: '@rnb/types',       href: '/docs/packages' },
            { id: 'pkg-hooks',       label: '@rnb/hooks',       href: '/docs/packages#hooks' },
            { id: 'pkg-errors',      label: '@rnb/errors',      href: '/docs/packages#errors' },
            { id: 'pkg-validators',  label: '@rnb/validators',  href: '/docs/packages#validators' },
            { id: 'pkg-middleware',  label: '@rnb/middleware',  href: '/docs/packages#middleware' },
            { id: 'pkg-security',    label: '@rnb/security',    href: '/docs/packages#security' },
            { id: 'pkg-assets',      label: '@rnb/assets',      href: '/docs/packages#assets' },
        ],
    },
    {
        title: 'Applications',
        items: [
            { id: 'app-aetherscribe',  label: 'Aetherscribe',    href: '/docs/apps' },
            { id: 'app-byte-burger',   label: 'Byte Burger',      href: '/docs/apps#byte-burger' },
            { id: 'app-nexus-serve',   label: 'Nexus Serve',      href: '/docs/apps#nexus-serve' },
            { id: 'app-landing',       label: 'R&B Landing',      href: '/docs/apps#landing' },
            { id: 'app-adding',        label: 'Adding an App',    href: '/docs/apps#adding' },
        ],
    },
    {
        title: 'Contributing',
        items: [
            { id: 'con-standards',  label: 'Code Standards',    href: '/docs/contributing' },
            { id: 'con-packages',   label: 'Adding a Package',  href: '/docs/contributing#packages' },
            { id: 'con-git',        label: 'Git Workflow',      href: '/docs/contributing#git' },
            { id: 'con-prs',        label: 'Pull Requests',     href: '/docs/contributing#prs' },
        ],
    },
]
