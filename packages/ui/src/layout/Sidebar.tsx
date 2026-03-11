'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import {
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Settings,
} from 'lucide-react'
import { I_Link, T_ObjectId } from '@rnb/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_OPEN_WIDTH = 260 // px — must match $sidebar-max / --sidebar-max
const SIDEBAR_RAIL_WIDTH = 48 // px — icon-only collapsed rail

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_SVGIcon = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

export type T_IconComponent = React.ComponentType<{
    size?: number
    strokeWidth?: number
    className?: string
    color?: string
}>

export interface I_SidebarItem extends Omit<I_Link, 'icon'> {
    id: string
    icon?: string | StaticImageData | T_SVGIcon | T_IconComponent
    children?: I_SidebarItem[]
}

export interface I_SidebarSection {
    title?: string
    items: I_SidebarItem[]
}

export interface I_SearchResult {
    id: T_ObjectId
    label: string
    href: string
}

export interface I_SidebarProps {
    sections: I_SidebarSection[]
    footer?: React.ReactNode
    searchFn?: (query: string) => I_SearchResult[]
    storageKey?: string
    defaultOpen?: boolean
    onSettingsClick?: () => void
}

interface I_SidebarMenuItemProps {
    item: I_SidebarItem
    pathName: string
    sidebarOpen: boolean
    depth?: number
    onMouseEnter: (e: React.MouseEvent<HTMLElement>, label: string) => void
    onMouseLeave: () => void
}

interface I_SidebarSearchProps {
    searchFn: (query: string) => I_SearchResult[]
}

interface I_TooltipState {
    label: string
    y: number
    visible: boolean
}

// ─── Icon renderer ────────────────────────────────────────────────────────────

function SidebarIcon({ icon }: { icon: I_SidebarItem['icon'] }) {
    if (!icon) return null

    if (typeof icon === 'function') {
        const Icon = icon as T_IconComponent
        return (
            <span
                className="sidebar-icon sidebar-icon--component"
                aria-hidden="true"
            >
                <Icon size={16} strokeWidth={1.5} color="currentColor" />
            </span>
        )
    }

    if (typeof icon === 'string') {
        return (
            <span
                className="sidebar-icon sidebar-icon--emoji"
                aria-hidden="true"
            >
                {icon}
            </span>
        )
    }

    return (
        <span className="sidebar-icon sidebar-icon--image" aria-hidden="true">
            <Image src={icon} alt="" width={16} height={16} />
        </span>
    )
}

// ─── Search bar ───────────────────────────────────────────────────────────────

const SidebarSearch = ({ searchFn }: I_SidebarSearchProps) => {
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
    onMouseEnter,
    onMouseLeave,
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
        <li
            className={liClass}
            style={{ '--depth': depth } as React.CSSProperties}
        >
            <Link
                href={hasChildren ? '#' : item.href}
                className={`sidebar-link${hasChildren ? ' sidebar-link--parent' : ''}`}
                onClick={hasChildren ? handleToggle : undefined}
                aria-expanded={hasChildren ? expanded : undefined}
                onMouseEnter={(e) => onMouseEnter(e, item.label)}
                onMouseLeave={onMouseLeave}
            >
                {item.icon && <SidebarIcon icon={item.icon} />}

                <span className="sidebar-label">{item.label}</span>

                {hasChildren && sidebarOpen && (
                    <span
                        className={`sidebar-chevron${expanded ? ' expanded' : ''}`}
                        aria-hidden="true"
                    >
                        <ChevronRight
                            size={14}
                            strokeWidth={1.5}
                            color="currentColor"
                        />
                    </span>
                )}
            </Link>

            {hasChildren && sidebarOpen && (
                <div
                    className={`sidebar-submenu${expanded ? ' sidebar-submenu--open' : ''}`}
                >
                    <ul className="sidebar-menu sidebar-submenu-inner">
                        {item.children!.map((child) => (
                            <SidebarMenuItem
                                key={child.id}
                                item={child}
                                pathName={pathName}
                                sidebarOpen={sidebarOpen}
                                depth={depth + 1}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
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
    onSettingsClick,
}: I_SidebarProps) => {
    const pathName = usePathname()
    const [open, setOpen] = useState<boolean | null>(null)
    const [tooltip, setTooltip] = useState<I_TooltipState>({
        label: '',
        y: 0,
        visible: false,
    })

    // Restore from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(storageKey)
        setOpen(stored === null ? defaultOpen : stored === 'true')
    }, [storageKey, defaultOpen])

    // Keep --sidebar-current-width in sync so .section-wrapper can offset itself
    useEffect(() => {
        if (open === null) return
        const w = open ? SIDEBAR_OPEN_WIDTH : SIDEBAR_RAIL_WIDTH
        document.documentElement.style.setProperty(
            '--sidebar-current-width',
            `${w}px`
        )
    }, [open])

    const toggle = () => {
        const next = !open
        setOpen(next)
        localStorage.setItem(storageKey, String(next))
    }

    // Tooltip — only fires when sidebar is collapsed
    const handleLinkMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLElement>, label: string) => {
            if (open) return
            const rect = (
                e.currentTarget as HTMLElement
            ).getBoundingClientRect()
            setTooltip({ label, y: rect.top + rect.height / 2, visible: true })
        },
        [open]
    )

    const handleLinkMouseLeave = useCallback(() => {
        setTooltip((t) => ({ ...t, visible: false }))
    }, [])

    if (open === null) return null

    return (
        <>
            <aside
                className={`sidebar-wrapper${open ? ' sidebar-open' : ' sidebar-collapsed'}`}
            >
                <div className="sidebar-inner">
                    {/* ── Controls ── */}
                    <div className="sidebar-controls">
                        {open && searchFn && (
                            <SidebarSearch searchFn={searchFn} />
                        )}

                        <div className="sidebar-controls-row">
                            {onSettingsClick && (
                                <button
                                    className="sidebar-control-btn"
                                    onClick={onSettingsClick}
                                    aria-label="Settings"
                                    type="button"
                                    onMouseEnter={(e) =>
                                        handleLinkMouseEnter(e, 'Settings')
                                    }
                                    onMouseLeave={handleLinkMouseLeave}
                                >
                                    <Settings
                                        size={16}
                                        strokeWidth={1.5}
                                        color="currentColor"
                                    />
                                    {open && (
                                        <span className="sidebar-control-label">
                                            Settings
                                        </span>
                                    )}
                                </button>
                            )}

                            <button
                                className="sidebar-control-btn sidebar-control-btn--toggle"
                                onClick={toggle}
                                aria-label={
                                    open ? 'Collapse sidebar' : 'Expand sidebar'
                                }
                                type="button"
                                onMouseEnter={(e) =>
                                    handleLinkMouseEnter(
                                        e,
                                        open ? 'Collapse' : 'Expand'
                                    )
                                }
                                onMouseLeave={handleLinkMouseLeave}
                            >
                                {open ? (
                                    <ChevronsLeft
                                        size={16}
                                        strokeWidth={1.5}
                                        color="currentColor"
                                    />
                                ) : (
                                    <ChevronsRight
                                        size={16}
                                        strokeWidth={1.5}
                                        color="currentColor"
                                    />
                                )}
                                {open && (
                                    <span className="sidebar-control-label">
                                        Collapse
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ── Nav ── */}
                    <nav className="sidebar-nav">
                        {sections.map((section, i) => (
                            <div key={i} className="sidebar-section">
                                {section.title && open && (
                                    <p className="sidebar-section-title">
                                        {section.title}
                                    </p>
                                )}
                                <ul className="sidebar-menu">
                                    {sections[i].items.map((item) => (
                                        <SidebarMenuItem
                                            key={item.id}
                                            item={item}
                                            pathName={pathName}
                                            sidebarOpen={open}
                                            onMouseEnter={handleLinkMouseEnter}
                                            onMouseLeave={handleLinkMouseLeave}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {footer && <div className="sidebar-footer">{footer}</div>}
                </div>
            </aside>

            {/* Floating tooltip — lives outside <aside> so it's never clipped */}
            <div
                className={`sidebar-tooltip${tooltip.visible ? ' sidebar-tooltip--visible' : ''}`}
                style={
                    { '--tooltip-y': `${tooltip.y}px` } as React.CSSProperties
                }
                aria-hidden="true"
            >
                {tooltip.label}
            </div>
        </>
    )
}
