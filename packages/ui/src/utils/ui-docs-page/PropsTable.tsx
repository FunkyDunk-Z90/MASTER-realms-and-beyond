import React from 'react'

export interface PropRow {
    prop: string
    type: string
    default?: string
    required?: boolean
    desc: string
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
    return (
        <div className="docs-table-wrap">
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.prop}>
                            <td>
                                <code className="docs-code-inline prop-name">
                                    {r.prop}
                                </code>
                                {r.required && (
                                    <span className="docs-req">required</span>
                                )}
                            </td>
                            <td>
                                <code className="docs-code-inline prop-type">
                                    {r.type}
                                </code>
                            </td>
                            <td>
                                <code className="docs-code-inline prop-default">
                                    {r.default ?? '—'}
                                </code>
                            </td>
                            <td className="docs-td-desc">{r.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
