import { Section, H3, P, CodeBlock, PropsTable, Callout } from '@rnb/ui'

const headerProps = [
    {
        prop: 'appName',
        type: 'string',
        required: true,
        desc: 'Displayed as the h1 title. Also used in image alt text.',
    },
    {
        prop: 'navbarItems',
        type: 'I_Link[]',
        required: true,
        desc: 'Navigation links passed to <Navbar>. Pass [] to render only the Logout button.',
    },
    {
        prop: 'hasAuth',
        type: 'boolean',
        default: 'false',
        desc: 'Renders the <Navbar> (including auth controls) when true.',
    },
    {
        prop: 'appLogo',
        type: 'StaticImageData',
        desc: 'Next.js image import. Renders a .logo-app <Image> that navigates to rootLink on click.',
    },
    {
        prop: 'appBanner',
        type: 'StaticImageData',
        desc: 'Wide banner image. Renders with .banner-app class alongside the logo.',
    },
    {
        prop: 'rootLink',
        type: 'string',
        desc: 'Route pushed when the title or logo is clicked.',
    },
]

const cssProps = [
    {
        prop: 'header-wrapper',
        type: 'className',
        desc: 'Base: position fixed, full-width, z-index 100, 80px height, primary border-bottom, secondary bg.',
    },
    {
        prop: 'header-wrapper.hidden',
        type: 'className',
        desc: 'transform: translateY(-100%) with cubic-bezier(0.4, 0, 0.2, 1) transition.',
    },
    {
        prop: 'header-spacer',
        type: 'className',
        desc: '80px sibling div. Prevents content jumping under the fixed header.',
    },
    {
        prop: 'header-overlay',
        type: 'className',
        desc: 'Full-screen backdrop, hidden by default.',
    },
    {
        prop: 'header-overlay.active',
        type: 'className',
        desc: 'Shows blurred overlay (backdrop-filter: blur(4px)) behind the open mobile nav.',
    },
    {
        prop: 'header-contents',
        type: 'className',
        desc: 'Grid: auto auto 1fr on desktop (logo · title · nav), auto 1fr below $tablet.',
    },
]

export default function HeaderSection() {
    return (
        <Section id="header" title="Header" tag="@rnb/ui · 'use client'">
            <P>
                A fixed top bar with intelligent scroll-hide behaviour. Hides
                immediately on scroll-down, reveals on intentional upward scroll
                using a velocity-smoothed accumulator. Also manages body
                scroll-lock when the mobile nav is open.
            </P>

            <Callout type="info">
                The <code className="docs-code-inline">Header</code> at the top
                of this page is the live component. Scroll down to see the hide
                behaviour in action.
            </Callout>

            <H3>Props</H3>
            <PropsTable rows={headerProps} />

            <H3>Scroll-hide algorithm</H3>
            <CodeBlock
                label="Scroll algorithm summary"
                lang="ts"
            >{`// Always visible if scrollY < headerHeight (80px)
// Scroll DOWN  → setIsHidden(true) immediately, reset accumulator
// Scroll UP    → accumulate delta using EMA-smoothed velocity
//                reveal only when accumulated > SHOW_THRESHOLD (50px)
// This prevents trackpad momentum bounce from flashing the header
//
// Tuning constants:
const SHOW_THRESHOLD = 50        // px of upward scroll required to reveal
const VELOCITY_ALPHA = 0.2       // EMA smoothing 0–1 (lower = smoother)
const MIN_VELOCITY   = 0.4       // ignore frames slower than this`}</CodeBlock>

            <H3>CSS classes</H3>
            <PropsTable rows={cssProps} />

            <H3>Usage example</H3>
            <CodeBlock
                label="app/layout.tsx"
                lang="tsx"
            >{`import logo from '@/assets/logo.png'
import { I_Link } from '@rnb/types'

const navItems: I_Link[] = [
  { id: 'home',     label: 'Home',     href: '/'         },
  { id: 'docs',     label: 'Docs',     href: '/docs'     },
  { id: 'settings', label: 'Settings', href: '/settings' },
]

<Header
  appName="Modularix"
  appLogo={logo}
  rootLink="/"
  navbarItems={navItems}
  hasAuth
/>`}</CodeBlock>
        </Section>
    )
}
