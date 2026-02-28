import { Section, H3, P, PropsTable, Callout } from '@rnb/ui'

const navbarProps = [
    {
        prop: 'items',
        type: 'I_Link[]',
        required: true,
        desc: 'Navigation links. Each rendered as a Next.js <Link> with .active class when pathname matches href.',
    },
    {
        prop: 'scrollLock',
        type: 'Dispatch<SetStateAction<boolean>>',
        required: true,
        desc: 'Setter from Header that drives body scroll-lock when the mobile nav is open.',
    },
    {
        prop: 'onNavigate',
        type: '(link: I_Link) => void',
        desc: 'Optional callback fired after a nav link is clicked.',
    },
]

const breakpointRows = [
    {
        breakpoint: '≥ 1025px',
        layout: 'Horizontal row',
        notes: 'Animated underline slides to active route using offsetWidth measurement + CSS transitions.',
    },
    {
        breakpoint: '< 1025px',
        layout: 'Burger drawer',
        notes: 'Nav hidden to the right (translateX(100%)). Burger icon animates to X on open via slide-in keyframe.',
    },
]

const cssProps = [
    {
        prop: 'nav-wrapper',
        type: 'className',
        desc: 'Relative container. On mobile: fixed-position drawer, 50% width, slides in from right.',
    },
    {
        prop: 'nav-wrapper.opened',
        type: 'className',
        desc: 'Triggers slide-in animation (0% → -1% translateX).',
    },
    {
        prop: 'nav-wrapper.closed',
        type: 'className',
        desc: 'Triggers slide-out animation (0% → 100% translateX).',
    },
    {
        prop: 'nav-link',
        type: 'className',
        desc: 'white-space: nowrap, font-size: 1.2rem. Active route gets --primary-color.',
    },
    {
        prop: 'nav-link-underline',
        type: 'className',
        desc: 'Absolute bar beneath links on desktop. Position/width calculated dynamically from link offsetWidth.',
    },
    {
        prop: 'nav-link-underline.hidden',
        type: 'className',
        desc: 'Applied when no route is active (activeIndex === -1).',
    },
    {
        prop: 'burgerIcon',
        type: 'className',
        desc: 'Three-line icon, visible only below $desktop. Lines animate to X when .active.',
    },
]

export default function NavbarSection() {
    return (
        <Section id="navbar" title="Navbar" tag="@rnb/ui · 'use client'">
            <P>
                Rendered by{' '}
                <code className="docs-code-inline">&lt;Header&gt;</code> when{' '}
                <code className="docs-code-inline">hasAuth</code> is set.
                Handles responsive behaviour: a horizontal link row on desktop
                with an animated underline tracker, collapsing to a burger-menu
                drawer on mobile (&lt; 1025px).
            </P>

            <Callout type="info">
                <strong>Internal component:</strong>{' '}
                <code className="docs-code-inline">Navbar</code> is consumed by{' '}
                <code className="docs-code-inline">Header</code>. You can import
                it directly for custom headers, but it requires a{' '}
                <code className="docs-code-inline">scrollLock</code> dispatch
                prop.
            </Callout>

            <H3>Props</H3>
            <PropsTable rows={navbarProps} />

            <H3>Responsive behaviour</H3>
            <div className="docs-table-wrap">
                <table className="docs-table">
                    <thead>
                        <tr>
                            <th>Breakpoint</th>
                            <th>Layout</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakpointRows.map((r) => (
                            <tr key={r.breakpoint}>
                                <td>
                                    <code className="docs-code-inline">
                                        {r.breakpoint}
                                    </code>
                                </td>
                                <td className="docs-td-desc">{r.layout}</td>
                                <td className="docs-td-desc">{r.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <H3>CSS classes</H3>
            <PropsTable rows={cssProps} />
        </Section>
    )
}
