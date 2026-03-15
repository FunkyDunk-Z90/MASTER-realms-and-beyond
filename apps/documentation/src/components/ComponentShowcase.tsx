'use client'

import { useState } from 'react'
import {
    Button,
    IconButton,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardDivider,
    CardText,
    Frame,
    Panel,
    Divider,
    Seal,
    Toast,
    StatBlock,
    CartridgeCard,
    Dropdown,
    CodeSnippet,
    PropsTable,
    SpacingGrid,
    type I_DropdownOption,
    type PropRow,
} from '@rnb/ui'

// ─── Static code examples ─────────────────────────────────────────────────────

const BUTTON_CODE = `import { Button, IconButton } from '@rnb/ui'

// All 11 variants
<Button variant="gold">Gold</Button>
<Button variant="royal">Royal</Button>
<Button variant="crimson">Crimson</Button>
<Button variant="parchment">Parchment</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="accent">Accent</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="submit">Submit</Button>
<Button variant="success">Success</Button>

// Sizes
<Button variant="gold" size="sm">Small</Button>
<Button variant="gold" size="md">Medium</Button>
<Button variant="gold" size="lg">Large</Button>

// States
<Button variant="gold" isLoading>Saving…</Button>
<Button variant="gold" isDisabled>Disabled</Button>

// Ornament slots (decorative text before/after children)
<Button variant="royal" leftOrnament="⚔" rightOrnament="⚔">Battle</Button>

// IconButton
<IconButton icon="⚔" label="Attack" variant="crimson" />`

const BUTTON_PROPS: PropRow[] = [
    { prop: 'variant', type: 'T_BtnVariant', default: '—', desc: 'Visual style: gold | royal | crimson | parchment | ghost | outline | accent | danger | warning | submit | success' },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: '—', desc: 'Size modifier applied via btn--sm / btn--md / btn--lg CSS class.' },
    { prop: 'leftOrnament', type: 'string', default: '—', desc: 'Decorative character rendered before the label.' },
    { prop: 'rightOrnament', type: 'string', default: '—', desc: 'Decorative character rendered after the label.' },
    { prop: 'isLoading', type: 'boolean', default: 'false', desc: 'Renders a spinner and disables interaction.' },
    { prop: 'isDisabled', type: 'boolean', default: 'false', desc: 'Disables the button and applies disabled styling.' },
    { prop: 'btnType', type: "'button' | 'reset' | 'submit'", default: "'button'", desc: 'HTML type attribute on the <button> element.' },
    { prop: 'handleClick / onClick', type: '(e?) => void', default: '—', desc: 'Click handler. Both names are accepted interchangeably.' },
    { prop: 'withRef', type: 'RefObject<HTMLButtonElement>', default: '—', desc: 'Forwarded ref attached to the underlying button element.' },
    { prop: 'className', type: 'string', default: "''", desc: 'Additional CSS class merged onto the root element.' },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

const CARD_CODE = `import { Card, CardHeader, CardBody, CardFooter, CardDivider, CardText } from '@rnb/ui'

// Full composition
<Card variant="dark" withCorners>
  <CardHeader
    eyebrow="LOCATION"
    title="The Ancient Vault"
    subtitle="Level 12 dungeon"
    badge="NEW"
  />
  <CardDivider label="✦" />
  <CardBody>
    <CardText>Hidden beneath the Obsidian Mountains...</CardText>
  </CardBody>
  <CardFooter>
    <Button variant="gold" size="sm">Enter</Button>
  </CardFooter>
</Card>

// Variants: dark | parchment | crimson | relic | glow | inset
<Card variant="parchment">...</Card>
<Card variant="relic" withCorners={false}>...</Card>

// Clickable card (gets role="button")
<Card variant="dark" onClick={() => navigate('/dungeon')}>...</Card>`

const CARD_PROPS: PropRow[] = [
    { prop: 'variant', type: 'T_CardVariant', default: "'dark'", desc: 'Visual style: dark | parchment | crimson | relic | glow | inset' },
    { prop: 'withCorners', type: 'boolean', default: 'true', desc: 'Renders ornamental SVG corner flourishes at each corner.' },
    { prop: 'onClick', type: '() => void', default: '—', desc: 'If provided, adds role="button" and makes the card interactive.' },
    { prop: 'className', type: 'string', default: "''", desc: 'Additional CSS class on the root element.' },
]

const CARD_HEADER_PROPS: PropRow[] = [
    { prop: 'title', type: 'string', required: true, desc: 'Primary heading of the card.' },
    { prop: 'eyebrow', type: 'string', default: '—', desc: 'Small all-caps label shown above the title.' },
    { prop: 'subtitle', type: 'string', default: '—', desc: 'Secondary text shown below the title.' },
    { prop: 'badge', type: 'string', default: '—', desc: 'Pill badge shown top-right of the header.' },
]

// ─── Frame ────────────────────────────────────────────────────────────────────

const FRAME_CODE = `import { Frame, Panel, Divider, StatBlock } from '@rnb/ui'

// Frame variants: portrait | scroll | crest
<Frame variant="portrait">
  <p>Portrait frame content</p>
</Frame>

// Panel variants: dark | parchment | ornate
<Panel variant="dark" title="Quest Log">
  <p>Retrieve the Orb of Eternity from Wraithspire.</p>
</Panel>

// Divider
<Divider ornament="◆" />
<Divider plain />

// StatBlock
<StatBlock stats={[
  { label: 'Worlds', value: 12 },
  { label: 'Characters', value: 48 },
  { label: 'Active Quests', value: 7 },
]} />`

// ─── Seal & Toast ─────────────────────────────────────────────────────────────

const DECORATIVE_CODE = `import { Seal, Toast } from '@rnb/ui'

// Seal variants: gold | silver | crimson | emerald
<Seal variant="gold">★ RPG</Seal>
<Seal variant="silver" icon="⚔">Combat</Seal>
<Seal variant="crimson">⛔ Restricted</Seal>
<Seal variant="emerald" icon="✓">Verified</Seal>

// Toast variants: decree | warning | danger
<Toast variant="decree" title="Proclamation" message="Your world has been saved." />
<Toast variant="warning" message="Unsaved changes will be lost." />
<Toast variant="danger" title="Connection Error" message="Could not reach the API." />`

// ─── CartridgeCard ────────────────────────────────────────────────────────────

const CARTRIDGE_CODE = `import { CartridgeCard } from '@rnb/ui'

<CartridgeCard
  title="Aetherscribe"
  subtitle="RPG Worldbuilding"
  description="Chronicle your worlds. Begin your legend."
  platform="REALMS & BEYOND"
  badge="★ RPG"
  tag="v1.0"
  size="md"
  onClick={() => router.push('/aetherscribe')}
/>

// With custom accent colour
<CartridgeCard
  title="ByteBurger"
  platform="REALMS & BEYOND"
  accentColor="#a83020"
  size="md"
/>

// As a Next.js link
<CartridgeCard title="NexusServe" href="/nexus-serve" />`

const CARTRIDGE_PROPS: PropRow[] = [
    { prop: 'title', type: 'string', required: true, desc: 'Game/content title on the label sticker.' },
    { prop: 'subtitle', type: 'string', default: '—', desc: 'Genre or subtitle shown below the title.' },
    { prop: 'description', type: 'string', default: '—', desc: 'Short body text on the label.' },
    { prop: 'platform', type: 'string', default: "'GAME BOY'", desc: 'Platform strip text at the top of the cartridge.' },
    { prop: 'badge', type: 'string', default: '—', desc: 'Small badge shown top-left of the label.' },
    { prop: 'tag', type: 'string', default: '—', desc: 'Version/tag shown bottom-right of the label.' },
    { prop: 'accentColor', type: 'string', default: '—', desc: 'CSS color string applied to the label accent via CSS variable.' },
    { prop: 'href', type: 'string', default: '—', desc: 'If provided, the card becomes a Next.js Link.' },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size variant controlling overall dimensions.' },
]

// ─── Dropdown ─────────────────────────────────────────────────────────────────

const DROPDOWN_CODE = `import { Dropdown } from '@rnb/ui'

// Basic controlled dropdown
const [val, setVal] = useState<string | undefined>()

<Dropdown
  options={[
    { id: '1', label: 'Aetherscribe', value: 'aetherscribe' },
    { id: '2', label: 'ByteBurger', value: 'byte-burger' },
    { id: '3', label: 'NexusServe', value: 'nexus-serve' },
  ]}
  selectedValue={val}
  placeholder="Select a product…"
  onChange={(value) => setVal(value)}
/>

// Searchable
<Dropdown options={options} searchable placeholder="Search…" />

// Nested (submenus triggered by clicking parent)
<Dropdown
  options={[
    {
      id: 'fe', label: 'Frontend',
      children: [
        { id: 'next', label: 'Next.js', value: 'next' },
        { id: 'react', label: 'React', value: 'react' },
      ],
    },
    {
      id: 'be', label: 'Backend',
      children: [
        { id: 'express', label: 'Express', value: 'express' },
        { id: 'mongo', label: 'Mongoose', value: 'mongoose' },
      ],
    },
  ]}
  placeholder="Select stack…"
/>`

const DROPDOWN_PROPS: PropRow[] = [
    { prop: 'options', type: 'I_DropdownOption[]', required: true, desc: 'Flat or nested option tree. Children trigger a submenu.' },
    { prop: 'selectedValue', type: 'string', default: '—', desc: 'Controlled selected value matched against option.value.' },
    { prop: 'placeholder', type: 'string', default: "'Select…'", desc: 'Displayed when no option is selected.' },
    { prop: 'searchable', type: 'boolean', default: 'false', desc: 'Adds a text input that filters visible options.' },
    { prop: 'openOnHover', type: 'boolean', default: 'false', desc: 'Opens submenus on mouse hover instead of click.' },
    { prop: 'closeOnSelect', type: 'boolean', default: 'true', desc: 'Closes the menu when a leaf option is selected.' },
    { prop: 'placement', type: 'T_DropdownPlacement', default: "'bottom'", desc: 'Menu placement: top | bottom | left | right (+start/end variants).' },
    { prop: 'onChange', type: '(value, option) => void', default: '—', desc: 'Called when a leaf option is selected.' },
    { prop: 'renderOption', type: '(option, isSelected, depth) => ReactNode', default: '—', desc: 'Custom render function for each option row.' },
]

// ─── CodeSnippet ──────────────────────────────────────────────────────────────

const CODE_SNIPPET_CODE = `import { CodeSnippet } from '@rnb/ui'

<CodeSnippet
  code={\`const world = {
  name: 'Aethoria',
  regions: ['The Obsidian Wastes', 'The Verdant Canopy'],
  createdAt: new Date().toISOString(),
}\`}
  lang="typescript"
  filename="world.ts"
  showCopy
/>`

const CODE_SNIPPET_PROPS: PropRow[] = [
    { prop: 'code', type: 'string', required: true, desc: 'The raw code string. Leading/trailing whitespace is trimmed before display.' },
    { prop: 'lang', type: 'string', default: "'typescript'", desc: 'Language label shown in the header badge.' },
    { prop: 'filename', type: 'string', default: '—', desc: 'Optional filename displayed in the header center.' },
    { prop: 'showCopy', type: 'boolean', default: 'true', desc: 'Renders the copy-to-clipboard button with Copied! feedback.' },
    { prop: 'className', type: 'string', default: "''", desc: 'Additional CSS class on the root element.' },
]

// ─── Design tokens ────────────────────────────────────────────────────────────

const DESIGN_TOKENS_CODE = `// CSS custom properties set by [data-theme="global-theme"]
// Apply automatically when @rnb/styles is loaded in layout.tsx

// Backgrounds
var(--bg-color)             // deepest background
var(--bg-secondary-color)   // sidebar / header
var(--bg-surface-color)     // cards, panels
var(--bg-inset-color)       // code blocks, inputs

// Text
var(--text-color)           // primary body text
var(--text-secondary-color) // body paragraphs
var(--text-muted-color)     // labels, captions
var(--text-heading-color)   // display headings

// Brand colours
var(--primary-color)        // amber gold
var(--primary-hover-color)
var(--primary-glow)         // rgba glow for hover fills
var(--accent-color)         // sage green
var(--accent-glow)

// Semantic
var(--danger-color)
var(--warning-color)
var(--success-color)
var(--submit-color)

// Borders & shadows
var(--border-color)
var(--border-strong-color)
var(--border-radius)        // 4px
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--rule-glow)

// Transitions
var(--transition-speed)     // 0.18s
var(--transition-slow)      // 0.35s`

// ─── Dropdown fixtures ────────────────────────────────────────────────────────

const BASIC_OPTIONS: I_DropdownOption[] = [
    { id: '1', label: 'Aetherscribe', value: 'aetherscribe' },
    { id: '2', label: 'ByteBurger', value: 'byte-burger' },
    { id: '3', label: 'NexusServe', value: 'nexus-serve' },
    { id: '4', label: 'Realms Portal', value: 'portal' },
]

const NESTED_OPTIONS: I_DropdownOption[] = [
    {
        id: 'fe', label: 'Frontend',
        children: [
            { id: 'next', label: 'Next.js', value: 'next' },
            { id: 'react', label: 'React', value: 'react' },
            { id: 'scss', label: 'SCSS', value: 'scss' },
        ],
    },
    {
        id: 'be', label: 'Backend',
        children: [
            { id: 'express', label: 'Express 5', value: 'express' },
            { id: 'mongoose', label: 'Mongoose 9', value: 'mongoose' },
            { id: 'ts', label: 'TypeScript', value: 'typescript' },
        ],
    },
    {
        id: 'tools', label: 'Tooling',
        children: [
            { id: 'turbo', label: 'Turborepo', value: 'turbo' },
            { id: 'pnpm', label: 'pnpm', value: 'pnpm' },
        ],
    },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function ComponentShowcase() {
    const [dropdownVal, setDropdownVal] = useState<string | undefined>()
    const [nestedVal, setNestedVal] = useState<string | undefined>()

    return (
        <div className="showcase">

            {/* ── Buttons ─────────────────────────────────────────────────────── */}
            <div id="comp-buttons" data-section="comp-buttons" className="comp-section">
                <h3 className="comp-title">Button</h3>
                <p className="comp-desc">
                    Core interactive element with 11 theme-aligned variants, 3 sizes, ornament slots, and loading/disabled states.
                    All variants derive colour from the active theme via CSS custom properties.
                </p>

                <p className="comp-label">Variants</p>
                <div className="comp-demo">
                    {(['gold', 'royal', 'crimson', 'parchment', 'ghost', 'outline', 'accent', 'danger', 'warning', 'submit', 'success'] as const).map((v) => (
                        <div key={v} className="comp-item">
                            <Button variant={v}>{v}</Button>
                            <span className="comp-item-label">{v}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">Sizes</p>
                <div className="comp-demo">
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                        <div key={s} className="comp-item">
                            <Button variant="gold" size={s}>{s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}</Button>
                            <span className="comp-item-label">{s}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">States & ornaments</p>
                <div className="comp-demo">
                    <div className="comp-item">
                        <Button variant="gold" isLoading>Saving</Button>
                        <span className="comp-item-label">isLoading</span>
                    </div>
                    <div className="comp-item">
                        <Button variant="gold" isDisabled>Disabled</Button>
                        <span className="comp-item-label">isDisabled</span>
                    </div>
                    <div className="comp-item">
                        <Button variant="royal" leftOrnament="⚔" rightOrnament="⚔">Battle</Button>
                        <span className="comp-item-label">ornaments</span>
                    </div>
                    <div className="comp-item">
                        <IconButton icon="⚔" label="Attack" variant="crimson" />
                        <span className="comp-item-label">IconButton</span>
                    </div>
                    <div className="comp-item">
                        <IconButton icon="🛡" label="Defend" variant="parchment" />
                        <span className="comp-item-label">IconButton</span>
                    </div>
                </div>

                <CodeSnippet code={BUTTON_CODE} lang="tsx" filename="Button usage" />
                <PropsTable rows={BUTTON_PROPS} />
            </div>

            {/* ── Cards ───────────────────────────────────────────────────────── */}
            <div id="comp-cards" data-section="comp-cards" className="comp-section">
                <h3 className="comp-title">Card</h3>
                <p className="comp-desc">
                    Ornate container with optional SVG corner flourishes. Composes with
                    <code className="ic">CardHeader</code>, <code className="ic">CardBody</code>,{' '}
                    <code className="ic">CardFooter</code>, <code className="ic">CardDivider</code>, and{' '}
                    <code className="ic">CardText</code> sub-components.
                </p>

                <p className="comp-label">Variants</p>
                <div className="comp-demo comp-demo--grid">
                    {(['dark', 'parchment', 'crimson', 'relic', 'glow', 'inset'] as const).map((v) => (
                        <div key={v} className="comp-card-wrap">
                            <Card variant={v} withCorners>
                                <CardHeader eyebrow="VARIANT" title={v.charAt(0).toUpperCase() + v.slice(1)} />
                                <CardBody>
                                    <CardText>Sample content inside a {v} card variant.</CardText>
                                </CardBody>
                            </Card>
                            <span className="comp-item-label">{v}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">Full composition</p>
                <div className="comp-demo">
                    <div className="comp-card-full">
                        <Card variant="dark" withCorners>
                            <CardHeader
                                eyebrow="LOCATION"
                                title="The Ancient Vault"
                                subtitle="Level 12 dungeon · Obsidian Mountains"
                                badge="NEW"
                            />
                            <CardDivider label="✦" />
                            <CardBody>
                                <CardText>
                                    Hidden beneath the Obsidian Mountains lies a vault of forgotten knowledge.
                                    Only those worthy of the ancient seal may pass the threshold.
                                </CardText>
                            </CardBody>
                            <CardFooter>
                                <Button variant="gold" size="sm">Enter</Button>
                                <Button variant="ghost" size="sm">Inspect</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <CodeSnippet code={CARD_CODE} lang="tsx" filename="Card usage" />
                <PropsTable rows={CARD_PROPS} />
                <p className="comp-sublabel">CardHeader props</p>
                <PropsTable rows={CARD_HEADER_PROPS} />
            </div>

            {/* ── Frame, Panel, Divider, StatBlock ────────────────────────────── */}
            <div id="comp-frames" data-section="comp-frames" className="comp-section">
                <h3 className="comp-title">Frame · Panel · Divider · StatBlock</h3>
                <p className="comp-desc">
                    Structural layout primitives. <code className="ic">Frame</code> wraps content in decorative corner flourishes.{' '}
                    <code className="ic">Panel</code> is a semantic section container with an optional title.{' '}
                    <code className="ic">Divider</code> is a horizontal rule with an ornament.{' '}
                    <code className="ic">StatBlock</code> renders a row of value/label stat pairs.
                </p>

                <p className="comp-label">Frame variants</p>
                <div className="comp-demo">
                    {(['portrait', 'scroll', 'crest'] as const).map((v) => (
                        <div key={v} className="comp-item">
                            <Frame variant={v}>
                                <p className="frame-sample">{v}</p>
                            </Frame>
                            <span className="comp-item-label">{v}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">Panel variants</p>
                <div className="comp-demo">
                    {(['dark', 'parchment', 'ornate'] as const).map((v) => (
                        <div key={v} className="comp-item">
                            <Panel variant={v} title={v.charAt(0).toUpperCase() + v.slice(1)}>
                                <p className="panel-sample">Panel body content.</p>
                            </Panel>
                            <span className="comp-item-label">{v}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">Divider</p>
                <div className="comp-demo comp-demo--col">
                    <div className="divider-row">
                        <span className="comp-item-label">default (◆)</span>
                        <Divider />
                    </div>
                    <div className="divider-row">
                        <span className="comp-item-label">custom ornament</span>
                        <Divider ornament="✦" />
                    </div>
                    <div className="divider-row">
                        <span className="comp-item-label">plain</span>
                        <Divider plain />
                    </div>
                </div>

                <p className="comp-label">StatBlock</p>
                <div className="comp-demo">
                    <StatBlock stats={[
                        { label: 'Worlds', value: 12 },
                        { label: 'Characters', value: 48 },
                        { label: 'Active Quests', value: 7 },
                        { label: 'Collaborators', value: 3 },
                    ]} />
                </div>

                <CodeSnippet code={FRAME_CODE} lang="tsx" filename="Frame / Panel / Divider / StatBlock usage" />
            </div>

            {/* ── Seal & Toast ────────────────────────────────────────────────── */}
            <div id="comp-decorative" data-section="comp-decorative" className="comp-section">
                <h3 className="comp-title">Seal · Toast</h3>
                <p className="comp-desc">
                    <code className="ic">Seal</code> is an inline badge for tags, categories, or status indicators.{' '}
                    <code className="ic">Toast</code> is a notification banner with title and message.
                </p>

                <p className="comp-label">Seal variants</p>
                <div className="comp-demo">
                    {([
                        ['gold', '★ RPG'],
                        ['silver', '⚔ Combat'],
                        ['crimson', '⛔ Restricted'],
                        ['emerald', '✓ Verified'],
                    ] as const).map(([v, label]) => (
                        <div key={v} className="comp-item">
                            <Seal variant={v}>{label}</Seal>
                            <span className="comp-item-label">{v}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">Toast variants</p>
                <div className="comp-demo comp-demo--col">
                    <Toast variant="decree" title="Proclamation" message="Your world has been saved to the Aetherscribe vault." />
                    <Toast variant="warning" message="Unsaved changes will be lost if you navigate away." />
                    <Toast variant="danger" title="Connection Error" message="Failed to connect to the Aetherscribe API. Retrying…" />
                </div>

                <CodeSnippet code={DECORATIVE_CODE} lang="tsx" filename="Seal / Toast usage" />
            </div>

            {/* ── CartridgeCard ───────────────────────────────────────────────── */}
            <div id="comp-cartridge" data-section="comp-cartridge" className="comp-section">
                <h3 className="comp-title">CartridgeCard</h3>
                <p className="comp-desc">
                    Game cartridge-style card for displaying products, apps, or content items. Modelled after SNES/GBA cartridges
                    with a label sticker, platform strip, connector pin row, and optional accent colour. Supports{' '}
                    <code className="ic">sm</code>, <code className="ic">md</code>, and <code className="ic">lg</code> sizes
                    and renders as a <code className="ic">Next.js Link</code> when <code className="ic">href</code> is provided.
                </p>

                <p className="comp-label">Sizes</p>
                <div className="comp-demo">
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                        <div key={s} className="comp-item">
                            <CartridgeCard
                                title="Aetherscribe"
                                subtitle="RPG Worldbuilding"
                                platform="REALMS & BEYOND"
                                badge="★ RPG"
                                tag="v1.0"
                                size={s}
                            />
                            <span className="comp-item-label">{s}</span>
                        </div>
                    ))}
                </div>

                <p className="comp-label">With full props + accent colours</p>
                <div className="comp-demo">
                    <CartridgeCard
                        title="ByteBurger"
                        subtitle="Food Ordering"
                        description="Order fresh, delivered fast to your door."
                        platform="REALMS & BEYOND"
                        badge="🍔 FOOD"
                        tag="v2.1"
                        accentColor="#a83020"
                        size="md"
                    />
                    <CartridgeCard
                        title="NexusServe"
                        subtitle="POS System"
                        description="Manage your restaurant operations."
                        platform="REALMS & BEYOND"
                        badge="🖥 POS"
                        tag="v1.4"
                        accentColor="#2858a0"
                        size="md"
                    />
                    <CartridgeCard
                        title="Realms Portal"
                        subtitle="Platform Hub"
                        description="Central platform landing and routing."
                        platform="REALMS & BEYOND"
                        badge="🌐 HUB"
                        tag="v1.0"
                        accentColor="#4a7a3c"
                        size="md"
                    />
                </div>

                <CodeSnippet code={CARTRIDGE_CODE} lang="tsx" filename="CartridgeCard usage" />
                <PropsTable rows={CARTRIDGE_PROPS} />
            </div>

            {/* ── Dropdown ────────────────────────────────────────────────────── */}
            <div id="comp-dropdown" data-section="comp-dropdown" className="comp-section">
                <h3 className="comp-title">Dropdown</h3>
                <p className="comp-desc">
                    Accessible dropdown menu with flat, searchable, and nested (submenu) configurations.
                    Click-outside closes the menu. Supports custom option rendering, controlled values, and hover-open submenus.
                </p>

                <p className="comp-label">Basic (controlled)</p>
                <div className="comp-demo">
                    <div className="comp-dropdown-wrap">
                        <Dropdown
                            options={BASIC_OPTIONS}
                            selectedValue={dropdownVal}
                            placeholder="Select a product…"
                            onChange={(v) => setDropdownVal(v ?? undefined)}
                        />
                        {dropdownVal && (
                            <span className="comp-item-label">Selected: {dropdownVal}</span>
                        )}
                    </div>
                </div>

                <p className="comp-label">Searchable</p>
                <div className="comp-demo">
                    <div className="comp-dropdown-wrap">
                        <Dropdown
                            options={BASIC_OPTIONS}
                            searchable
                            placeholder="Search products…"
                        />
                    </div>
                </div>

                <p className="comp-label">Nested submenus</p>
                <div className="comp-demo">
                    <div className="comp-dropdown-wrap">
                        <Dropdown
                            options={NESTED_OPTIONS}
                            selectedValue={nestedVal}
                            placeholder="Select tech stack…"
                            onChange={(v) => setNestedVal(v ?? undefined)}
                        />
                        {nestedVal && (
                            <span className="comp-item-label">Selected: {nestedVal}</span>
                        )}
                    </div>
                </div>

                <CodeSnippet code={DROPDOWN_CODE} lang="tsx" filename="Dropdown usage" />
                <PropsTable rows={DROPDOWN_PROPS} />
            </div>

            {/* ── CodeSnippet ─────────────────────────────────────────────────── */}
            <div id="comp-code-snippet" data-section="comp-code-snippet" className="comp-section">
                <h3 className="comp-title">CodeSnippet</h3>
                <p className="comp-desc">
                    Code display component with language badge, optional filename, and copy-to-clipboard.
                    Backed by <code className="ic">.code-snippet</code> global classes from <code className="ic">@rnb/styles</code>.
                    Used throughout this documentation to render all code examples.
                </p>

                <p className="comp-label">Demo</p>
                <CodeSnippet
                    code={`const world = {
  name: 'Aethoria',
  regions: ['The Obsidian Wastes', 'The Verdant Canopy', 'The Shattered Peaks'],
  lore: 'Ancient magic courses through the ley lines beneath every mountain range.',
  createdAt: new Date().toISOString(),
}

export function buildWorld(config: typeof world) {
  return { ...config, id: crypto.randomUUID() }
}`}
                    lang="typescript"
                    filename="world.ts"
                    showCopy
                />

                <CodeSnippet code={CODE_SNIPPET_CODE} lang="tsx" filename="CodeSnippet usage" />
                <PropsTable rows={CODE_SNIPPET_PROPS} />
            </div>

            {/* ── Design Tokens ───────────────────────────────────────────────── */}
            <div id="comp-tokens" data-section="comp-tokens" className="comp-section">
                <h3 className="comp-title">Design Tokens</h3>
                <p className="comp-desc">
                    All components consume CSS custom properties set by the active theme on <code className="ic">[data-theme]</code>.
                    Switch themes with the <code className="ic">ThemeSwitcher</code> component — no class changes needed, just swap the attribute.
                </p>

                <p className="comp-label">Spacing scale</p>
                <div className="comp-demo">
                    <SpacingGrid />
                </div>

                <CodeSnippet code={DESIGN_TOKENS_CODE} lang="css" filename="@rnb/styles CSS variables reference" />
            </div>

        </div>
    )
}
