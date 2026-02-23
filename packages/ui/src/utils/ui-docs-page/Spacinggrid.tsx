import React from 'react'

const spacings = [
    { name: '$small', val: '0.3rem', w: 14 },
    { name: '$medium', val: '0.5rem', w: 24 },
    { name: '$large', val: '1rem', w: 48 },
    { name: '$xLarge', val: '1.5rem', w: 72 },
]

export function SpacingGrid() {
    return (
        <div className="docs-spacing-grid">
            {spacings.map((s) => (
                <div key={s.name} className="docs-spacing-row">
                    <span className="docs-spacing-label">
                        {s.name} · {s.val}
                    </span>
                    <div className="docs-spacing-bar" style={{ width: s.w }} />
                </div>
            ))}
        </div>
    )
}
