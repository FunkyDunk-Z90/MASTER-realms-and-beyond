'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCodex } from '@/src/context/CodexContext'
import { Settings2Icon } from 'lucide-react'

// ─── Codex Selector ───────────────────────────────────────────────────────────
// Sidebar-footer widget: shows active codex name + dropdown to switch or create.
// In collapsed rail mode the name/caret hide and only the icon is visible.
// Dropdown uses position:fixed so it escapes sidebar overflow:hidden.

export default function CodexSelector() {
    const {
        codices,
        activeCodex,
        limits,
        setActiveCodex,
        createCodex,
        isLoading,
    } = useCodex()

    const atLimit =
        limits.maxCodices !== null && codices.length >= limits.maxCodices
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState('')
    const [error, setError] = useState('')

    const triggerRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

    // Position dropdown to the right of the sidebar, anchored at its bottom edge
    const positionDropdown = useCallback(() => {
        if (!triggerRef.current) return
        const sidebar = triggerRef.current.closest('.sidebar-wrapper')
        const rect = (sidebar ?? triggerRef.current).getBoundingClientRect()
        setDropdownStyle({
            position: 'fixed',
            bottom: window.innerHeight - rect.bottom + 8,
            left: rect.right + 8,
            minWidth: 220,
        })
    }, [])

    function handleTrigger() {
        positionDropdown()
        setOpen((v) => !v)
    }

    // Close on outside click
    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                dropdownRef.current?.contains(e.target as Node)
            )
                return
            setOpen(false)
            setCreating(false)
            setError('')
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (!newName.trim()) return
        try {
            setError('')
            await createCodex(newName.trim())
            setNewName('')
            setCreating(false)
            setOpen(false)
        } catch (err: any) {
            setError(err.message ?? 'Failed to create codex.')
        }
    }

    if (isLoading) {
        return (
            <div className="codex-selector">
                <div className="codex-selector__trigger codex-selector__trigger--loading">
                    <span className="codex-selector__icon" aria-hidden="true">
                        ◫
                    </span>
                    <span className="codex-selector__name">Loading…</span>
                </div>
            </div>
        )
    }

    return (
        <div className="codex-selector">
            <button
                ref={triggerRef}
                className={`codex-selector__trigger${open ? ' codex-selector__trigger--open' : ''}`}
                onClick={handleTrigger}
                type="button"
                title={activeCodex?.name ?? 'No codex selected'}
                aria-label={`Active codex: ${activeCodex?.name ?? 'none'}. Click to switch.`}
                aria-expanded={open}
            >
                <span className="codex-selector__icon" aria-hidden="true">
                    ◫
                </span>
                <span className="codex-selector__name">
                    {activeCodex?.name ?? '—'}
                </span>
                <span className="codex-selector__caret" aria-hidden="true">
                    {open ? '▲' : '▼'}
                </span>
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="codex-selector__dropdown"
                    style={dropdownStyle}
                >
                    <p className="codex-selector__dropdown-label">
                        Choose your Codex
                    </p>

                    <ul className="codex-selector__list">
                        {codices.map((c) => (
                            <li key={c.id}>
                                <div
                                    className={`codex-selector__item${c.id === activeCodex?.id ? ' codex-selector__item--active' : ''}`}
                                >
                                    <button
                                        className="codex-selector__item-btn"
                                        onClick={() => {
                                            setActiveCodex(c)
                                            setOpen(false)
                                            router.push(`/hub/${c.id}`)
                                        }}
                                        type="button"
                                    >
                                        <span className="codex-selector__item-name">
                                            {c.name}
                                        </span>
                                        {c.isDefault && (
                                            <span className="codex-selector__default-badge">
                                                default
                                            </span>
                                        )}
                                    </button>
                                    <Link
                                        href={`/hub/${c.id}/manage`}
                                        className="codex-selector__manage-link"
                                        onClick={() => setOpen(false)}
                                        title="Manage codex"
                                    >
                                        <Settings2Icon size={16} />
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="codex-selector__divider" />

                    {atLimit ? (
                        <p className="codex-selector__limit-msg">
                            Codex limit reached ({limits.maxCodices}). Upgrade
                            your plan to create more.
                        </p>
                    ) : creating ? (
                        <form
                            className="codex-selector__create-form"
                            onSubmit={handleCreate}
                        >
                            <input
                                className="codex-selector__input"
                                placeholder="Codex name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                maxLength={80}
                                autoFocus
                            />
                            {error && (
                                <p className="codex-selector__error">{error}</p>
                            )}
                            <div className="codex-selector__create-actions">
                                <button
                                    className="codex-selector__btn codex-selector__btn--primary"
                                    type="submit"
                                >
                                    Create
                                </button>
                                <button
                                    className="codex-selector__btn codex-selector__btn--secondary"
                                    type="button"
                                    onClick={() => {
                                        setCreating(false)
                                        setError('')
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            className="codex-selector__new-btn"
                            type="button"
                            onClick={() => setCreating(true)}
                        >
                            + New Codex
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
