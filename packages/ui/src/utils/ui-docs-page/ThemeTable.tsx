import React from 'react'

const themeRows = [
    [
        'undefined',
        '.btn',
        '--primary-color',
        '--primary-hover-color background',
    ],
    [
        'accent',
        '.btn.accent',
        '--accent-color',
        'Box shadow glow in --accent-color',
    ],
    [
        'danger',
        '.btn.danger',
        '--danger-color',
        'Box shadow glow in --danger-color',
    ],
    [
        'warning',
        '.btn.warning',
        '--warning-color',
        'Dark text ($dark), glow in --warning-color',
    ],
    [
        'submit',
        '.btn.submit',
        '--submit-color',
        'Box shadow glow in --submit-color',
    ],
    [
        'success',
        '.btn.success',
        '--success-color',
        'Box shadow glow in --success-color',
    ],
    [
        'disabled / isDisabled',
        '.btn.disabled',
        '--disabled-color',
        'cursor: not-allowed, no transform',
    ],
]

export function ThemeTable() {
    return (
        <div className="docs-table-wrap">
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>theme</th>
                        <th>CSS class</th>
                        <th>Background var</th>
                        <th>Hover behaviour</th>
                    </tr>
                </thead>
                <tbody>
                    {themeRows.map(([t, cls, bg, hover]) => (
                        <tr key={t}>
                            <td>
                                <code className="docs-code-inline prop-name">
                                    {t}
                                </code>
                            </td>
                            <td>
                                <code className="docs-code-inline prop-type">
                                    {cls}
                                </code>
                            </td>
                            <td>
                                <code className="docs-code-inline prop-default">
                                    {bg}
                                </code>
                            </td>
                            <td className="docs-td-desc">{hover}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
