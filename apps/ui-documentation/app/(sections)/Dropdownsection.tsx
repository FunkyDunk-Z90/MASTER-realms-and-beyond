'use client'

import { useState } from 'react'

import {
    Dropdown,
    Section,
    H3,
    P,
    CodeBlock,
    PropsTable,
    Callout,
} from '@rnb/ui'
import {
    basicOptions,
    nestedOptions,
    searchableOptions,
} from '../(data)/dropdownOptions'

const dropdownProps = [
    {
        prop: 'options',
        type: 'I_DropdownOption[]',
        required: true,
        desc: 'The full option tree. Each option can have a children array for nested menus.',
    },
    {
        prop: 'selectedValue',
        type: 'string',
        desc: 'Controlled selection. Must match an option.value.',
    },
    {
        prop: 'placeholder',
        type: 'string',
        default: "'Select…'",
        desc: 'Shown when no option is selected.',
    },
    {
        prop: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Prevents opening the menu.',
    },
    {
        prop: 'closeOnSelect',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-close after selecting a leaf option.',
    },
    {
        prop: 'searchable',
        type: 'boolean',
        default: 'false',
        desc: 'Renders a text input above the menu. Filters all levels recursively.',
    },
    {
        prop: 'openOnHover',
        type: 'boolean',
        default: 'false',
        desc: 'Sub-menus open on mouseenter instead of click.',
    },
    {
        prop: 'placement',
        type: 'T_DropdownPlacement',
        desc: "Position hint: 'bottom' | 'top' | 'left' | 'right' with optional '-start' | '-end' suffix.",
    },
    {
        prop: 'onChange',
        type: '(value, option) => void',
        desc: 'Fires with the selected option.value and full option object.',
    },
    {
        prop: 'renderOption',
        type: '(option, isSelected, depth) => ReactNode',
        desc: 'Custom renderer per option. Receives selection state and nesting depth.',
    },
    { prop: 'id', type: 'string', desc: 'Passed to the root wrapper <div>.' },
    {
        prop: 'children',
        type: 'ReactNode',
        default: '▾ icon',
        desc: 'Custom trigger icon/node rendered after the label.',
    },
]

export default function DropdownSection() {
    const [basicVal, setBasicVal] = useState<string | undefined>()
    const [nestedVal, setNestedVal] = useState<string | undefined>()
    const [searchVal, setSearchVal] = useState<string | undefined>()

    return (
        <Section id="dropdown" title="Dropdown" tag="@rnb/ui · 'use client'">
            <P>
                A fully featured, accessible dropdown with nested multi-level
                menus, search filtering, hover-open mode, and a custom renderer.
                Manages its own open/close state and closes on outside click.
            </P>

            <H3>Live demos</H3>
            <div className="docs-demo-card">
                <div className="docs-demo-row docs-demo-row--wrap">
                    <div className="docs-demo-col">
                        <p className="docs-demo-label">Basic controlled</p>
                        <Dropdown
                            options={basicOptions}
                            selectedValue={basicVal}
                            placeholder="Navigate to…"
                            onChange={(v) => setBasicVal(v)}
                        />
                        {basicVal && (
                            <p className="docs-demo-hint">
                                Selected: <strong>{basicVal}</strong>
                            </p>
                        )}
                    </div>

                    <div className="docs-demo-col">
                        <p className="docs-demo-label">Nested + hover open</p>
                        <Dropdown
                            options={nestedOptions}
                            selectedValue={nestedVal}
                            placeholder="Choose report…"
                            openOnHover
                            onChange={(v) => setNestedVal(v)}
                        />
                    </div>

                    <div className="docs-demo-col">
                        <p className="docs-demo-label">Searchable</p>
                        <Dropdown
                            options={searchableOptions}
                            selectedValue={searchVal}
                            placeholder="Search language…"
                            searchable
                            onChange={(v) => setSearchVal(v)}
                        />
                    </div>

                    <div className="docs-demo-col">
                        <p className="docs-demo-label">Disabled</p>
                        <Dropdown
                            options={basicOptions}
                            placeholder="Unavailable"
                            disabled
                            onChange={() => {}}
                        />
                    </div>
                </div>
            </div>

            <H3>Props</H3>
            <PropsTable rows={dropdownProps} />

            <H3>I_DropdownOption shape</H3>
            <CodeBlock label="types" lang="ts">{`interface I_DropdownOption {
  id:           string
  label:        string       // display text (also searched)
  value?:       string       // passed to onChange; leaf options only
  description?: string
  iconName?:    string
  disabled?:    boolean
  children?:    I_DropdownOption[]  // nesting → submenu
}`}</CodeBlock>

            <H3>Usage examples</H3>
            <CodeBlock
                label="Basic controlled"
                lang="tsx"
            >{`import { Dropdown, I_DropdownOption } from '@rnb/ui'
import { useState } from 'react'

const options: I_DropdownOption[] = [
  { id: '1', label: 'Dashboard', value: 'dashboard' },
  { id: '2', label: 'Profile',   value: 'profile'   },
  { id: '3', label: 'Admin',     value: 'admin', disabled: true },
]

function MyComponent() {
  const [val, setVal] = useState<string>()
  return (
    <Dropdown
      options={options}
      selectedValue={val}
      placeholder="Navigate to…"
      onChange={(v) => setVal(v)}
    />
  )
}`}</CodeBlock>

            <CodeBlock
                label="Nested + hover open"
                lang="tsx"
            >{`const nested: I_DropdownOption[] = [
  {
    id: 'reports', label: 'Reports',
    children: [
      { id: 'monthly', label: 'Monthly', value: 'monthly' },
      { id: 'annual',  label: 'Annual',  value: 'annual'  },
    ]
  },
  { id: 'export', label: 'Export CSV', value: 'export' },
]

<Dropdown options={nested} openOnHover onChange={handleChange} />`}</CodeBlock>

            <CodeBlock
                label="Searchable with custom renderer"
                lang="tsx"
            >{`<Dropdown
  options={largeOptions}
  searchable
  placeholder="Search items…"
  renderOption={(option, isSelected, depth) => (
    <span style={{ paddingLeft: depth * 12 }}>
      {isSelected && '✓ '}{option.label}
    </span>
  )}
  onChange={handleChange}
/>`}</CodeBlock>

            <Callout type="info">
                <strong>Search filtering:</strong> Walks the entire option tree
                recursively. A parent node is kept in results if any of its
                children match, preserving the submenu structure.
            </Callout>
        </Section>
    )
}
