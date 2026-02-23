import React from 'react'

interface CodeBlockProps {
    label?: string
    lang?: string
    children: React.ReactNode
}

export function CodeBlock({ label, lang, children }: CodeBlockProps) {
    return (
        <div className="docs-code-block">
            <div className="docs-code-header">
                <span>{label}</span>
                <span className="docs-code-lang">{lang}</span>
            </div>
            <pre className="docs-pre">{children}</pre>
        </div>
    )
}
