import React from 'react'

const cssVars = [
    ['--bg-color', '$light (#e0e0e0)', '$dark (#181818)', 'body background'],
    [
        '--bg-secondary-color',
        '$light-secondary',
        '$dark-secondary',
        'Header, Footer, Sidebar, cards',
    ],
    ['--bg-primary-color', '$primary-light', '—', 'Navbar hover, section bg'],
    ['--text-color', '$dark', '$light', 'All text'],
    ['--primary-color', '#5f4680', '—', 'Buttons, borders, active states'],
    ['--primary-hover-color', '#7c42a3', '—', 'Button hover, link hover'],
    ['--accent-color', '#cfae70', '—', 'Accent buttons, sidebar headings'],
    ['--danger-color', '#b0182c', '—', 'Danger buttons'],
    ['--warning-color', '#dbd02e', '—', 'Warning buttons, error text'],
    ['--success-color', '#29971f', '—', 'Success buttons'],
    ['--submit-color', '#1f5d97', '—', 'Submit/form buttons'],
    ['--disabled-color', '#adadad', '—', 'Disabled button state'],
    ['--blur', '$light-blur', '$dark-blur', 'Header overlay backdrop'],
    ['--sidebar-max', '400px', '—', 'Sidebar default width'],
    ['--sidebar-min', '125px', '—', 'Sidebar compact width'],
    ['--header-height', '100px', '—', 'Offset calculations'],
    ['--nav-height', '80px', '—', 'Header rendered height'],
    ['--transition-speed', '0.3s', '—', 'All CSS transitions'],
]

export function CssVarsTable() {
    return (
        <div className="docs-table-wrap">
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Variable</th>
                        <th>Light value</th>
                        <th>Dark override</th>
                        <th>Used by</th>
                    </tr>
                </thead>
                <tbody>
                    {cssVars.map(([name, light, dark, used]) => (
                        <tr key={name}>
                            <td>
                                <code className="docs-code-inline prop-name">
                                    {name}
                                </code>
                            </td>
                            <td>
                                <code className="docs-code-inline prop-default">
                                    {light}
                                </code>
                            </td>
                            <td>
                                <code className="docs-code-inline prop-type">
                                    {dark}
                                </code>
                            </td>
                            <td className="docs-td-desc">{used}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
