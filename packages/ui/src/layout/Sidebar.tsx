'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import { I_Link, T_ObjectId } from '@rnb/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface I_SidebarItem extends Omit<I_Link, 'icon'> {
    id: string
    /** String emoji/class, or a Next.js StaticImageData import. */
    icon?: string | StaticImageData
    children?: I_SidebarItem[]
}

export interface I_SidebarSection {
    title?: string
    items: I_SidebarItem[]
}

export interface I_SearchResult {
    /** Unique stable key for React rendering */
    id: T_ObjectId
    /** Display label shown in the dropdown */
    label: string
    /** Route the user is taken to on click */
    href: string
}

export interface I_SidebarProps {
    sections: I_SidebarSection[]
    footer?: React.ReactNode
    /**
     * Optional search function supplied by the consumer.
     * Receives the current query string and returns a list of results.
     * When omitted the search bar is not rendered.
     */
    searchFn?: (query: string) => I_SearchResult[]
    /**
     * localStorage key used to persist the open/closed state.
     * @default 'rnb-sidebar-open'
     */
    storageKey?: string
    /**
     * Whether the sidebar starts open on first visit (before localStorage is read).
     * @default false
     */
    defaultOpen?: boolean
}

interface I_SidebarMenuItemProps {
    item: I_SidebarItem
    pathName: string
    sidebarOpen: boolean
    depth?: number
}

interface I_SidebarSearchProps {
    open: boolean
    searchFn: (query: string) => I_SearchResult[]
}

// ─── Icon renderer ────────────────────────────────────────────────────────────

function SidebarIcon({ icon }: { icon: string | StaticImageData }) {
    if (typeof icon === 'string') {
        return (
            <span className="sidebar-icon sidebar-icon--text" aria-hidden="true">
                {icon}
            </span>
        )
    }
    return (
        <Image
            src={icon}
            alt=""
            width={16}
            height={16}
            className="sidebar-icon sidebar-icon--img"
            aria-hidden="true"
        />
    )
}

// ─── Search bar ───────────────────────────────────────────────────────────────

const SidebarSearch = ({ open, searchFn }: I_SidebarSearchProps) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<I_SearchResult[]>([])
    const [focused, setFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            setQuery(val)
            setResults(searchFn(val))
        },
        [searchFn]
    )

    const handleClear = () => {
        setQuery('')
        setResults([])
        inputRef.current?.focus()
    }

    // Dismiss results when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const showResults = focused && query.length > 0

    if (!open) return null

    return (
        <div ref={wrapperRef} className="sidebar-search-wrapper">
            <div className="sidebar-search-input-row">
                <span className="sidebar-search-icon" aria-hidden="true">
                    ⚲
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="sidebar-search-input"
                    placeholder="Search…"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setFocused(true)}
                    aria-label="Search sidebar content"
                    aria-expanded={showResults}
                    aria-haspopup="listbox"
                    autoComplete="off"
                />
                {query && (
                    <button
                        className="sidebar-search-clear"
                        onClick={handleClear}
                        aria-label="Clear search"
                        type="button"
                    >
                        ✕
                    </button>
                )}
            </div>

            {showResults && (
                <div className="sidebar-search-results" role="listbox">
                    {results.length === 0 ? (
                        <p className="sidebar-search-empty">
                            No results for &ldquo;{query}&rdquo;
                        </p>
                    ) : (
                        <ul className="sidebar-search-result-list">
                            {results.map((r) => (
                                <li key={r.id as string}>
                                    <Link
                                        href={r.href}
                                        className="sidebar-search-result-item"
                                        onClick={() => {
                                            setQuery('')
                                            setResults([])
                                            setFocused(false)
                                        }}
                                    >
                                        {r.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Menu item ────────────────────────────────────────────────────────────────

const SidebarMenuItem = ({
    item,
    pathName,
    sidebarOpen,
    depth = 0,
}: I_SidebarMenuItemProps) => {
    const hasChildren = !!item.children?.length

    const isChildActive = (items: I_SidebarItem[]): boolean =>
        items.some(
            (child) =>
                pathName === child.href ||
                (child.children && isChildActive(child.children))
        )

    const [expanded, setExpanded] = useState<boolean>(
        () => hasChildren && isChildActive(item.children!)
    )

    const isActive = pathName === item.href

    const handleToggle = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.preventDefault()
            setExpanded((prev) => !prev)
        }
    }

    const liClass = [
        'sidebar-item',
        isActive ? 'active' : '',
        hasChildren ? 'has-children' : '',
        depth > 0 ? 'sidebar-item--nested' : '',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <li className={liClass} style={{ '--depth': depth } as React.CSSProperties}>
            <Link
                href={hasChildren ? '#' : item.href}
                className={`sidebar-link${hasChildren ? ' sidebar-link--parent' : ''}`}
                onClick={hasChildren ? handleToggle : undefined}
                aria-expanded={hasChildren ? expanded : undefined}
            >
                {item.icon && <SidebarIcon icon={item.icon} />}

                <span className="sidebar-label">{item.label}</span>

                {hasChildren && sidebarOpen && (
                    <span
                        className={`sidebar-chevron${expanded ? ' expanded' : ''}`}
                        aria-hidden="true"
                    >
                        ›
                    </span>
                )}
            </Link>

            {hasChildren && (
                <div className={`sidebar-submenu${expanded ? ' sidebar-submenu--open' : ''}`}>
                    <ul className="sidebar-menu sidebar-submenu-inner">
                        {item.children!.map((child) => (
                            <SidebarMenuItem
                                key={child.id}
                                item={child}
                                pathName={pathName}
                                sidebarOpen={sidebarOpen}
                                depth={depth + 1}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar = ({
    sections,
    footer,
    searchFn,
    storageKey = 'rnb-sidebar-open',
    defaultOpen = false,
}: I_SidebarProps) => {
    const pathName = usePathname()
    const [open, setOpen] = useState<boolean | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem(storageKey)
        setOpen(stored === null ? defaultOpen : stored === 'true')
    }, [storageKey, defaultOpen])

    const toggle = () => {
        const next = !open
        setOpen(next)
        localStorage.setItem(storageKey, String(next))
    }

    // Avoid layout flash before localStorage is read
    if (open === null) return null

    return (
        <>
            {/* Pill toggle sits outside <aside> so it's visible when collapsed */}
            <button
                className={`sidebar-pill-toggle${open ? ' sidebar-pill-toggle--open' : ''}`}
                onClick={toggle}
                aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                type="button"
            >
                <span
                    className={`sidebar-pill-chevron${open ? ' open' : ''}`}
                    aria-hidden="true"
                >
                    ›
                </span>
            </button>

            <aside className={`sidebar-wrapper${open ? ' sidebar-open' : ' sidebar-collapsed'}`}>
                {searchFn && <SidebarSearch open={open} searchFn={searchFn} />}

                <nav className="sidebar-nav">
                    {sections.map((section, i) => (
                        <div key={i} className="sidebar-section">
                            {section.title && open && (
                                <p className="sidebar-section-title">{section.title}</p>
                            )}
                            <ul className="sidebar-menu">
                                {section.items.map((item) => (
                                    <SidebarMenuItem
                                        key={item.id}
                                        item={item}
                                        pathName={pathName}
                                        sidebarOpen={open}
                                    />
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {footer && <div className="sidebar-footer">{footer}</div>}
            </aside>
        </>
    )
}
