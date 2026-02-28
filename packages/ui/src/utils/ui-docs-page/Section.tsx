import React from 'react'

interface SectionProps {
    id: string
    title: string
    tag?: string
    children: React.ReactNode
}

export function Section({ id, title, tag, children }: SectionProps) {
    return (
        <section className="docs-section" id={id}>
            <h2 className="docs-h2">
                {title}
                {tag && <span className="docs-tag">{tag}</span>}
            </h2>
            {children}
        </section>
    )
}

export function H3({ children }: { children: React.ReactNode }) {
    return <h3 className="docs-h3">{children}</h3>
}

export function P({ children }: { children: React.ReactNode }) {
    return <p className="docs-p">{children}</p>
}
