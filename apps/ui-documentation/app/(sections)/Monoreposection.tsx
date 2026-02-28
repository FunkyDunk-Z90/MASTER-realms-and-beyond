import { Section, P, CodeBlock } from '@rnb/ui'

export default function MonorepoSection() {
    return (
        <Section id="monorepo" title="Monorepo Imports">
            <P>
                All packages are registered via{' '}
                <code className="docs-code-inline">tsconfig.json</code> path
                aliases. Always use the package alias — never relative paths
                that cross package boundaries.
            </P>

            <CodeBlock label="tsconfig.json (root)" lang="json">{`{
  "compilerOptions": {
    "paths": {
      "@rnb/ui":     ["packages/ui/src/index.ts"],
      "@rnb/styles": ["packages/styles/index.scss"],
      "@rnb/types":  ["packages/types/index.ts"]
    }
  }
}`}</CodeBlock>

            <CodeBlock
                label="All component + type imports"
                lang="tsx"
            >{`// Components
import { Button }   from '@rnb/ui'
import { Dropdown } from '@rnb/ui'
import { Header }   from '@rnb/ui'
import { Footer }   from '@rnb/ui'
import { Navbar }   from '@rnb/ui'
import { Sidebar }  from '@rnb/ui'

// Sidebar types
import { I_SidebarSection, I_SidebarProps, T_SidebarVariant } from '@rnb/ui'

// Dropdown types
import { I_DropdownOption, I_DropdownProps, T_DropdownPlacement } from '@rnb/ui'

// Shared types
import { I_Link } from '@rnb/types'

// Global styles — ONCE, at root layout only
import '@rnb/styles'`}</CodeBlock>
        </Section>
    )
}
