import React from 'react'

interface CalloutProps {
    type?: 'info' | 'warn' | 'tip'
    children: React.ReactNode
}

const ICONS = { warn: '⚠', tip: '✓', info: 'ℹ' } as const

export function Callout({ type = 'info', children }: CalloutProps) {
    return (
        <div className={`docs-callout docs-callout-${type}`}>
            <span className="docs-callout-icon">{ICONS[type]}</span>
            <div>{children}</div>
        </div>
    )
}
