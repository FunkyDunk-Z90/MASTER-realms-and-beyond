import React from 'react'

const swatches = [
    { name: '$primary', val: '#5f4680', bg: '#5f4680' },
    { name: '$primary-hover', val: '#7c42a3', bg: '#7c42a3' },
    { name: '$primary-light', val: '#5a4d6b', bg: '#5a4d6b' },
    { name: '$accent', val: '#cfae70', bg: '#cfae70' },
    { name: '$danger', val: '#b0182c', bg: '#b0182c' },
    { name: '$warning', val: '#dbd02e', bg: '#dbd02e' },
    { name: '$success', val: '#29971f', bg: '#29971f' },
    { name: '$submit', val: '#1f5d97', bg: '#1f5d97' },
    { name: '$disabled', val: '#adadad', bg: '#adadad' },
    { name: '$dark', val: '#181818', bg: '#181818', border: true },
    { name: '$light', val: '#e0e0e0', bg: '#e0e0e0' },
]

export function SwatchGrid() {
    return (
        <div className="docs-swatch-grid">
            {swatches.map((s) => (
                <div key={s.name} className="docs-swatch">
                    <div
                        className="docs-swatch-color"
                        style={{
                            background: s.bg,
                            border: s.border ? '1px solid #353535' : undefined,
                        }}
                    />
                    <span className="docs-swatch-name">{s.name}</span>
                    <span className="docs-swatch-val">{s.val}</span>
                </div>
            ))}
        </div>
    )
}
