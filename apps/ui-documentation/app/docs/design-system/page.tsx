import { Section, H3, P, CodeBlock, Callout } from '@rnb/ui'

export default function DesignSystemPage() {
    return (
        <>
            <div className="docs-hero">
                <p className="docs-eyebrow">@rnb/styles</p>
                <h1 className="docs-h1">Design System</h1>
                <p className="docs-hero-sub">
                    The <code className="docs-code-inline">@rnb/styles</code> package is the single
                    source of truth for all visual decisions — spacing, colour, typography, shadows,
                    and motion. It ships as raw SCSS (no compiled CSS) so every consumer gets
                    full access to variables and mixins at build time.
                </p>
            </div>

            {/* ── Overview ── */}
            <Section id="overview" title="Overview">
                <P>
                    Import the styles package <strong>once</strong> at the root layout of each app.
                    Never import it at the component level — SCSS global styles should be
                    injected exactly once per page.
                </P>
                <CodeBlock label="app/layout.tsx" lang="tsx">{`import '@rnb/styles'   // single import at root layout only`}</CodeBlock>

                <H3>What this import includes</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>File</th><th>Contents</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">_variables.scss</code></td><td>SCSS variables — spacing, border-radius, font stacks, z-index</td></tr>
                            <tr><td><code className="docs-code-inline">_mixins.scss</code></td><td>Utility mixins — typography shortcuts, scanlines, active states, responsive</td></tr>
                            <tr><td><code className="docs-code-inline">_themes.scss</code></td><td>CSS custom property theme definitions (8 themes)</td></tr>
                            <tr><td><code className="docs-code-inline">global/</code></td><td>CSS reset, root defaults, typography base, animations, utility classes</td></tr>
                            <tr><td><code className="docs-code-inline">components/</code></td><td>Component-level SCSS — buttons, inputs, modals, cards, navigation, tables</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Using variables and mixins in a component SCSS file</H3>
                <CodeBlock label="my-component.scss" lang="scss">{`@use '@rnb/styles/variables' as *;
@use '@rnb/styles/mixins' as *;

// Inside packages/styles/ component files, use relative paths:
// @use '../_variables' as *;
// @use '../_mixins' as *;

.my-component {
    padding: $medium $large;
    border-radius: $border-radius;
    font-family: $font-body;
    color: var(--text-color);
    transition: background-color var(--transition-speed) ease;
}`}</CodeBlock>
            </Section>

            {/* ── Design Tokens ── */}
            <Section id="tokens" title="Design Tokens" tag="SCSS Variables">
                <P>
                    Design tokens are defined as SCSS variables in{' '}
                    <code className="docs-code-inline">packages/styles/_variables.scss</code>.
                    They are the lowest layer — consumed by mixins, component SCSS, and
                    occasionally converted to CSS custom properties in themes.
                </P>

                <H3>Spacing scale</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Value</th><th>Usage</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">$small</code></td><td>0.3rem</td><td>Tight gaps, icon padding, micro spacing</td></tr>
                            <tr><td><code className="docs-code-inline">$medium</code></td><td>0.5rem</td><td>Standard inner padding, form fields, list gaps</td></tr>
                            <tr><td><code className="docs-code-inline">$large</code></td><td>1rem</td><td>Section padding, card padding, button padding</td></tr>
                            <tr><td><code className="docs-code-inline">$xLarge</code></td><td>1.5rem</td><td>Modal body, hero areas, generous whitespace</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Shape & motion</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Value</th><th>Notes</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">$border-radius</code></td><td>2px</td><td>Pixel-sharp — the retro arcade signature</td></tr>
                            <tr><td><code className="docs-code-inline">$border-radius-lg</code></td><td>4px</td><td>Used for pill toggles and larger surfaces</td></tr>
                            <tr><td><code className="docs-code-inline">$transition-speed</code></td><td>0.18s</td><td>Base transition; all micro-interactions</td></tr>
                            <tr><td><code className="docs-code-inline">$transition-slow</code></td><td>0.35s</td><td>Larger structural transitions</td></tr>
                            <tr><td><code className="docs-code-inline">$scanline-opacity</code></td><td>0.03</td><td>Signature retro CRT scanline texture intensity</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Layout dimensions</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Value</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">$header-height</code></td><td>60px</td></tr>
                            <tr><td><code className="docs-code-inline">$footer-height</code></td><td>56px</td></tr>
                            <tr><td><code className="docs-code-inline">$navbar-height</code></td><td>60px</td></tr>
                            <tr><td><code className="docs-code-inline">$sidebar-max</code></td><td>240px</td></tr>
                            <tr><td><code className="docs-code-inline">$sidebar-min</code></td><td>48px</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Font stacks</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Family</th><th>Role</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">$font-display</code></td><td>Cormorant Garamond</td><td>H1–H3 display headings, fantasy inscriptional serif</td></tr>
                            <tr><td><code className="docs-code-inline">$font-body</code></td><td>Share Tech Mono</td><td>Body copy, data readouts, monospaced terminal feel</td></tr>
                            <tr><td><code className="docs-code-inline">$font-ui</code></td><td>Barlow Condensed</td><td>HUD labels, badges, tags, nav items</td></tr>
                            <tr><td><code className="docs-code-inline">$font-mono</code></td><td>Share Tech Mono</td><td>Code blocks, technical values</td></tr>
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* ── CSS Variables ── */}
            <Section id="css-vars" title="CSS Variables" tag="Custom Properties">
                <P>
                    CSS custom properties are defined per-theme under{' '}
                    <code className="docs-code-inline">[data-theme=&quot;...&quot;]</code> selectors
                    in <code className="docs-code-inline">packages/styles/_themes.scss</code> (and
                    the individual files in <code className="docs-code-inline">themes/</code>). They
                    are the runtime layer — components reference these exclusively, never hardcoded colours.
                </P>

                <H3>Background surfaces</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Usage</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">--bg-color</code></td><td>Page background — the darkest base surface</td></tr>
                            <tr><td><code className="docs-code-inline">--bg-secondary-color</code></td><td>Sidebar, navbar, and panel backgrounds</td></tr>
                            <tr><td><code className="docs-code-inline">--bg-surface-color</code></td><td>Card surfaces, elevated containers</td></tr>
                            <tr><td><code className="docs-code-inline">--bg-inset-color</code></td><td>Input backgrounds, inset wells, code blocks</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Text hierarchy</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Usage</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">--text-color</code></td><td>Primary body text</td></tr>
                            <tr><td><code className="docs-code-inline">--text-secondary-color</code></td><td>Secondary labels, sidebar nav items</td></tr>
                            <tr><td><code className="docs-code-inline">--text-muted-color</code></td><td>Placeholder text, hints, disabled states</td></tr>
                            <tr><td><code className="docs-code-inline">--text-heading-color</code></td><td>H1–H3 headings</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Brand / accent colours</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Usage</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">--primary-color</code></td><td>Brand primary — borders, active states, CTA</td></tr>
                            <tr><td><code className="docs-code-inline">--primary-hover-color</code></td><td>Lighter variant for hover text and icons</td></tr>
                            <tr><td><code className="docs-code-inline">--primary-deep-color</code></td><td>Deeper/darker pressed state</td></tr>
                            <tr><td><code className="docs-code-inline">--primary-glow</code></td><td>Translucent glow for hover backgrounds and shadows</td></tr>
                            <tr><td><code className="docs-code-inline">--primary-glow-strong</code></td><td>Stronger glow for focus rings (<code className="docs-code-inline">0 0 0 2px</code>)</td></tr>
                            <tr><td><code className="docs-code-inline">--accent-color</code></td><td>Secondary brand accent (chevrons, decorative)</td></tr>
                            <tr><td><code className="docs-code-inline">--accent-dim-color</code></td><td>Muted accent for section titles, labels</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Semantic colours</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Usage</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">--danger-color</code></td><td>Error states, destructive actions</td></tr>
                            <tr><td><code className="docs-code-inline">--danger-glow</code></td><td>Danger focus ring and glow</td></tr>
                            <tr><td><code className="docs-code-inline">--warning-color</code></td><td>Warning indicators</td></tr>
                            <tr><td><code className="docs-code-inline">--success-color</code></td><td>Success states, confirmations</td></tr>
                            <tr><td><code className="docs-code-inline">--submit-color</code></td><td>Primary submit/CTA button background</td></tr>
                            <tr><td><code className="docs-code-inline">--disabled-color</code></td><td>Disabled element tint</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Borders, shadows & motion</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Variable</th><th>Usage</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">--border-color</code></td><td>Standard border colour</td></tr>
                            <tr><td><code className="docs-code-inline">--border-strong-color</code></td><td>Emphasized border (dividers, modal edges)</td></tr>
                            <tr><td><code className="docs-code-inline">--shadow-sm / --shadow-md / --shadow-lg</code></td><td>Box shadow scale</td></tr>
                            <tr><td><code className="docs-code-inline">--rule-color</code></td><td>Horizontal rule / decorative line colour</td></tr>
                            <tr><td><code className="docs-code-inline">--rule-glow</code></td><td>Glowing rule (amber phosphor line)</td></tr>
                            <tr><td><code className="docs-code-inline">--blur</code></td><td>Modal backdrop blur / scrim colour</td></tr>
                            <tr><td><code className="docs-code-inline">--transition-speed</code></td><td>Component transition duration (mirrors SCSS var)</td></tr>
                            <tr><td><code className="docs-code-inline">--transition-slow</code></td><td>Slower structural transitions</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Layout dimensions (mirrored as CSS vars)</H3>
                <CodeBlock label="Example usage in component" lang="scss">{`// Read the sidebar width at runtime — respects theme overrides
width: calc(100% - var(--sidebar-max, #{$sidebar-max}));
top: var(--header-height, #{$header-height});`}</CodeBlock>
            </Section>

            {/* ── Themes ── */}
            <Section id="themes" title="Themes">
                <P>
                    Themes are activated by setting the <code className="docs-code-inline">data-theme</code> attribute
                    on the <code className="docs-code-inline">&lt;html&gt;</code> element. The{' '}
                    <code className="docs-code-inline">ThemeProvider</code> component handles this
                    automatically based on the user&apos;s selection stored in localStorage.
                </P>

                <CodeBlock label="Manual theme activation" lang="html">{`<!-- Set theme on the root element -->
<html data-theme="arcade">
<!-- or -->
<html data-theme="phosphor" data-mode="dark">`}</CodeBlock>

                <H3>Available themes</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Theme ID</th><th>Character</th><th>Primary</th><th>Accent</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">arcade</code></td><td>Default — warm dark, amber glow</td><td>#C47818 (amber)</td><td>#4A8A52 (phosphor green)</td></tr>
                            <tr><td><code className="docs-code-inline">phosphor</code></td><td>CRT terminal — near-black + green</td><td>#3A8A48 (crt-green)</td><td>#C47818 (amber)</td></tr>
                            <tr><td><code className="docs-code-inline">sovereign</code></td><td>Crimson authority — dark + crimson</td><td>#8A2820 (crimson)</td><td>#C4A018 (pale-gold)</td></tr>
                            <tr><td><code className="docs-code-inline">void</code></td><td>Sci-fi — cold dark + teal + violet</td><td>#1A7280 (teal)</td><td>#7A4A9A (violet)</td></tr>
                            <tr><td><code className="docs-code-inline">dusk</code></td><td>Mystical — purple-dark + amethyst</td><td>#5A3A8A (amethyst)</td><td>#C47080 (rose)</td></tr>
                            <tr><td><code className="docs-code-inline">parchment</code></td><td>Light mode — cream + olive</td><td>#3A4A1A (olive)</td><td>#8A4028 (terracotta)</td></tr>
                            <tr><td><code className="docs-code-inline">byte-burger</code></td><td>App theme — hot-orange fast food</td><td>#D46010 (hot-orange)</td><td>#D4A818 (mustard)</td></tr>
                            <tr><td><code className="docs-code-inline">snes</code></td><td>16-bit pixel — SNES blue + gold</td><td>#3860D8 (SNES blue)</td><td>#F8C820 (SNES gold)</td></tr>
                            <tr><td><code className="docs-code-inline">n64</code></td><td>Console charcoal — N64 logo gradient</td><td>#0066CC (logo blue)</td><td>#FFD200 (logo yellow)</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Creating a new theme</H3>
                <CodeBlock label="packages/styles/themes/_mytheme.scss" lang="scss">{`// 1. Create the theme file
[data-theme='mytheme'] {
    --bg-color:             #0f0e17;
    --bg-secondary-color:   #1a192e;
    --bg-surface-color:     #252440;
    --bg-inset-color:       #0d0c1a;

    --text-color:           #e8e6f0;
    --text-secondary-color: #b0adcc;
    --text-muted-color:     #6e6a88;
    --text-heading-color:   #f0eeff;

    --primary-color:        #7c4dff;
    --primary-hover-color:  #9e6fff;
    --primary-deep-color:   #5c2ee0;
    --primary-glow:         rgba(124, 77, 255, 0.12);
    --primary-glow-strong:  rgba(124, 77, 255, 0.32);

    --accent-color:         #ff6e91;
    --accent-dim-color:     #7a3448;
    --accent-glow:          rgba(255, 110, 145, 0.15);

    --border-color:         rgba(124, 77, 255, 0.2);
    --border-strong-color:  rgba(124, 77, 255, 0.4);

    --danger-color:         #ff4444;
    --danger-glow:          rgba(255, 68, 68, 0.2);
    --warning-color:        #ffaa44;
    --success-color:        #44dd88;
    --submit-color:         #5c2ee0;
    --disabled-color:       #3a3858;

    --shadow-sm:  0 1px 4px rgba(0, 0, 0, 0.4);
    --shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5);
    --shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.6);

    --rule-color: rgba(124, 77, 255, 0.3);
    --rule-glow:  0 0 8px rgba(124, 77, 255, 0.5);
    --blur:       rgba(10, 8, 20, 0.7);

    --transition-speed: 0.18s;
    --transition-slow:  0.35s;

    --sidebar-max:    240px;
    --sidebar-min:    48px;
    --header-height:  60px;
    --footer-height:  56px;
    --navbar-height:  60px;
}`}</CodeBlock>

                <CodeBlock label="packages/styles/_themes.scss" lang="scss">{`// 2. Import it in _themes.scss
@use './themes/mytheme';`}</CodeBlock>

                <CodeBlock label="packages/ui/src/context/ThemeContext.tsx" lang="tsx">{`// 3. Add the theme ID to the type union
export type T_ThemeName =
    | 'arcade' | 'phosphor' | 'sovereign' | 'void'
    | 'dusk' | 'parchment' | 'byte-burger'
    | 'snes' | 'n64'
    | 'mytheme'   // ← add here

export const VALID_THEMES: T_ThemeName[] = [
    'arcade', 'phosphor', 'sovereign', 'void',
    'dusk', 'parchment', 'byte-burger',
    'snes', 'n64',
    'mytheme',   // ← and here
]`}</CodeBlock>

                <CodeBlock label="packages/ui/src/context/ThemeSwitcher.tsx" lang="tsx">{`// 4. Add it to THEME_OPTIONS so it appears in the switcher UI
{ id: 'mytheme', label: 'My Theme', value: 'mytheme',
  description: 'Brief description of what this theme feels like' },`}</CodeBlock>

                <Callout type="tip">
                    After adding a new theme, rebuild <code className="docs-code-inline">@rnb/styles</code>{' '}
                    and <code className="docs-code-inline">@rnb/ui</code> with{' '}
                    <code className="docs-code-inline">pnpm build:packages</code> before the
                    new theme will be visible in apps.
                </Callout>
            </Section>

            {/* ── Typography ── */}
            <Section id="typography" title="Typography">
                <P>
                    Three Google Fonts form the typographic system. Each maps to a semantic role
                    so themes can theoretically swap them without breaking component layouts.
                </P>

                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Font</th><th>Variable</th><th>Role</th><th>Weights</th></tr></thead>
                        <tbody>
                            <tr><td>Cormorant Garamond</td><td><code className="docs-code-inline">$font-display</code></td><td>Display headings H1–H3, decorative titles</td><td>300, 400, 500 (+ italic)</td></tr>
                            <tr><td>Share Tech Mono</td><td><code className="docs-code-inline">$font-body</code></td><td>Body copy, data readouts, terminal aesthetic</td><td>400</td></tr>
                            <tr><td>Barlow Condensed</td><td><code className="docs-code-inline">$font-ui</code></td><td>HUD labels, badges, nav items, tags</td><td>400, 500</td></tr>
                            <tr><td>Press Start 2P</td><td>—</td><td>SNES theme only — pixel bitmap font</td><td>400</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Typography mixins</H3>
                <CodeBlock label="Usage in SCSS" lang="scss">{`@use '../_mixins' as *;

.my-heading {
    @include font-display;        // Cormorant Garamond, weight 400
    font-size: 1.4rem;
}

.my-label {
    @include font-label;          // Barlow Condensed, weight 500, letter-spacing
    font-size: 0.7rem;
    text-transform: uppercase;
}

.my-code {
    @include font-mono;           // Share Tech Mono
    font-size: 0.85rem;
}`}</CodeBlock>

                <H3>Heading scale (base — override per theme)</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Element</th><th>Size</th><th>Font</th><th>Class</th></tr></thead>
                        <tbody>
                            <tr><td>h1</td><td>clamp(1.6rem, 4vw, 2.4rem)</td><td>Cormorant Garamond</td><td>—</td></tr>
                            <tr><td>h2</td><td>clamp(1.2rem, 3vw, 1.8rem)</td><td>Cormorant Garamond</td><td>—</td></tr>
                            <tr><td>h3</td><td>1.2rem</td><td>Cormorant Garamond</td><td>—</td></tr>
                            <tr><td>body</td><td>0.875rem</td><td>Share Tech Mono</td><td>—</td></tr>
                            <tr><td>.text-muted</td><td>inherit</td><td>inherit</td><td>muted colour</td></tr>
                        </tbody>
                    </table>
                </div>

                <Callout type="warn">
                    The <strong>Press Start 2P</strong> pixel font (used in the SNES theme) renders
                    very large at standard sizes. Use values in the 0.45–0.9rem range and avoid
                    applying <code className="docs-code-inline">text-shadow</code> at small sizes —
                    it causes a &ldquo;doubled text&rdquo; artefact due to the pixel density.
                </Callout>
            </Section>

            {/* ── SCSS Architecture ── */}
            <Section id="scss" title="SCSS Architecture">
                <CodeBlock label="packages/styles/ full tree" lang="tree">{`packages/styles/
├── global.scss               # Entry point barrel — import this in apps
├── _variables.scss           # SCSS design tokens
├── _mixins.scss              # Core utility mixins
├── _themes.scss              # @use imports for all theme files
│
├── global/
│   ├── _reset.scss           # CSS reset (box-sizing, margin, etc.)
│   ├── _root.scss            # :root custom properties, body defaults
│   ├── _typography.scss      # Base h1–h6, p, a, code styles
│   ├── _animations.scss      # @keyframes — fade, slide, scale
│   └── _utils.scss           # Utility classes (.text-muted, .sr-only, etc.)
│
├── themes/
│   ├── _dark.scss            # (included in arcade)
│   ├── _light.scss           # (included in parchment)
│   ├── _byte-burger.scss     # ByteBurger app theme
│   ├── _snes.scss            # SNES 16-bit theme
│   └── _n64.scss             # N64 theme
│
├── mixins/
│   ├── _typography.scss      # Font mixins (cormorant, inter, share-tech, barlow)
│   ├── _buttons.scss         # Button variant mixins
│   ├── _flexbox.scss         # Flex shorthand mixins
│   ├── _grid.scss            # Grid helpers
│   ├── _forms.scss           # Form field mixins
│   ├── _states.scss          # Active, focus, hover state mixins
│   ├── _animations.scss      # Animation shorthand mixins
│   └── _responsive.scss      # Breakpoint mixins
│
└── components/
    ├── indexUi.scss          # Barrel — imports all component styles
    ├── buttons.scss
    ├── cards.scss
    ├── inputs.scss
    ├── modals.scss
    ├── navigation.scss
    ├── tables.scss
    └── ui/                   # Sub-components (navbar, sidebar, footer, etc.)
        ├── layout/
        │   ├── navbar.scss
        │   ├── sidebar.scss
        │   └── footer.scss
        ├── util/
        │   ├── button.scss
        │   ├── dropdown.scss
        │   └── form.scss
        └── cards/
            ├── indexCards.scss
            ├── categoryCard.scss
            ├── cartridgeCard.scss
            └── user-profile.scss`}</CodeBlock>

                <H3>Adding a new component style</H3>
                <P>
                    Component SCSS files live in{' '}
                    <code className="docs-code-inline">packages/styles/components/ui/</code>.
                    Each file must:
                </P>
                <CodeBlock label="my-component.scss template" lang="scss">{`// 1. Always use relative @use at the top
@use '../../../_variables' as *;
@use '../../../_mixins' as *;

// 2. Use CSS custom properties for all colours — never hardcode
.my-component {
    background-color: var(--bg-surface-color);
    border: 1px solid var(--border-color);
    border-radius: $border-radius;   // SCSS var for shape
    padding: $medium $large;          // SCSS vars for spacing
    color: var(--text-color);         // CSS var for colour
    transition: background-color var(--transition-speed) ease;
}`}</CodeBlock>

                <CodeBlock label="components/ui/[category]/indexCards.scss" lang="scss">{`// 3. Add the @use in the relevant barrel file
@use './categoryCard.scss';
@use './my-component.scss';  // ← add your file here`}</CodeBlock>

                <Callout type="info">
                    SCSS files in <code className="docs-code-inline">packages/styles/</code> are never
                    compiled standalone. They are consumed via{' '}
                    <code className="docs-code-inline">sass-loader</code> (or equivalent) at the app
                    level. Variable and mixin resolution happens at the consumer&apos;s compile time.
                </Callout>
            </Section>
        </>
    )
}
