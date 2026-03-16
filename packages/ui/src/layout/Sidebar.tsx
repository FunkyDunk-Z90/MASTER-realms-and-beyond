'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import {
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Settings,
    Menu,
} from 'lucide-react'
import { I_Link, T_ObjectId } from '@rnb/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_OPEN_WIDTH = 220 // px — must match $sidebar-max / --sidebar-max
const SIDEBAR_RAIL_WIDTH = 48 // px — icon-only collapsed rail
const MOBILE_BREAKPOINT = 768 // px — matches $tablet in _variables.scss

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
    /**
     * Nav sections to render.
     * Pass a static array for fixed navigation, or a zero-argument factory
     * function for dynamic navigation (e.g. sections that depend on React
     * context).  The factory is called on every render so the caller should
     * stabilise it with useCallback when the source value changes infrequently.
     */
    sections: I_SidebarSection[] | (() => I_SidebarSection[])
    footer?: React.ReactNode
    /** Rendered on the left side of the controls row when the sidebar is expanded. */
    headerSlot?: React.ReactNode
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
// Handles two function-component icon types:
//   • Lucide icons    — consume size / strokeWidth / color
//   • TSX SVG icons   — consume width / height / strokeWidth / color (SVGProps)
// Both prop sets are passed so each type takes what it needs.
// color="currentColor" lets the SVG inherit CSS color: var(--text-color) from
// the parent .sidebar-icon span, making icons respond to theme changes.

function SidebarIcon({ icon }: { icon: I_SidebarItem['icon'] }) {
    if (!icon) return null

    if (typeof icon === 'function') {
        const Icon = icon as React.ComponentType<Record<string, unknown>>
        return (
            <span
                className="sidebar-icon sidebar-icon--component"
                aria-hidden="true"
            >
                <Icon
                    size={16}
                    width={16}
                    height={16}
                    strokeWidth={1.5}
                    color="currentColor"
                />
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
    headerSlot,
    searchFn,
    storageKey = 'rnb-sidebar-open',
    defaultOpen = false,
    onSettingsClick,
}: I_SidebarProps) => {
    const pathName = usePathname()
    const resolvedSections = useMemo(
        () => (typeof sections === 'function' ? sections() : sections),
        [sections]
    )
    const [open, setOpen] = useState<boolean | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [tooltip, setTooltip] = useState<I_TooltipState>({
        label: '',
        y: 0,
        visible: false,
    })

    // Init: detect mobile breakpoint and restore desktop state from localStorage.
    // On mobile, sidebar always starts hidden — not persisted.
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const mobile = mq.matches
        setIsMobile(mobile)

        if (mobile) {
            setOpen(false)
        } else {
            const stored = localStorage.getItem(storageKey)
            setOpen(stored === null ? defaultOpen : stored === 'true')
        }

        const handler = (e: MediaQueryListEvent) => {
            // Suppress sidebar transitions during breakpoint crossings so the
            // sidebar snaps instantly rather than playing a close/open animation.
            setIsResizing(true)
            setIsMobile(e.matches)
            if (e.matches) setOpen(false)
            // Two rAFs: first lets React flush the render, second lets the
            // browser paint — then transitions are safe to re-enable.
            requestAnimationFrame(() =>
                requestAnimationFrame(() => setIsResizing(false))
            )
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [storageKey, defaultOpen])

    // Keep --sidebar-current-width in sync so .section-wrapper can offset itself.
    // On mobile: 0 (hidden) or full open width (overlaid). No rail on mobile.
    useEffect(() => {
        if (open === null) return
        const w = isMobile
            ? open
                ? SIDEBAR_OPEN_WIDTH
                : 0
            : open
              ? SIDEBAR_OPEN_WIDTH
              : SIDEBAR_RAIL_WIDTH
        document.documentElement.style.setProperty(
            '--sidebar-current-width',
            `${w}px`
        )
    }, [open, isMobile])

    const toggle = () => {
        const next = !open
        setOpen(next)
        // Persist desktop state only — mobile state is always transient
        if (!isMobile) {
            localStorage.setItem(storageKey, String(next))
        }
    }

    // Tooltip — only fires when sidebar is collapsed in desktop rail mode
    const handleLinkMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLElement>, label: string) => {
            if (open || isMobile) return
            const rect = (
                e.currentTarget as HTMLElement
            ).getBoundingClientRect()
            setTooltip({ label, y: rect.top + rect.height / 2, visible: true })
        },
        [open, isMobile]
    )

    const handleLinkMouseLeave = useCallback(() => {
        setTooltip((t) => ({ ...t, visible: false }))
    }, [])

    if (open === null) return null

    const asideClasses = [
        'sidebar-wrapper',
        open ? 'sidebar-open' : 'sidebar-collapsed',
        isMobile ? 'sidebar-mobile' : '',
        isResizing ? 'sidebar-no-transition' : '',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <>
            {/* Mobile backdrop overlay — closes sidebar on tap */}
            {isMobile && open && (
                <div
                    className="sidebar-overlay"
                    onClick={toggle}
                    aria-hidden="true"
                />
            )}

            {/* Mobile open trigger — floats in content area when sidebar is hidden */}
            {isMobile && !open && (
                <button
                    className="sidebar-mobile-trigger"
                    onClick={toggle}
                    aria-label="Open sidebar"
                    type="button"
                >
                    <Menu size={18} strokeWidth={1.5} color="currentColor" />
                </button>
            )}

            <aside className={asideClasses}>
                <div className="sidebar-inner">
                    {/* ── Controls ── */}
                    <div className="sidebar-controls">
                        {open && searchFn && (
                            <SidebarSearch searchFn={searchFn} />
                        )}

                        <div className="sidebar-controls-row">
                            {/* {open && headerSlot && (
                                <div className="sidebar-header-slot">
                                    {headerSlot}
                                </div>
                            )} */}

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
                        {resolvedSections.map((section, i) => (
                            <div key={i} className="sidebar-section">
                                {section.title && open && (
                                    <p className="sidebar-section-title">
                                        {section.title}
                                    </p>
                                )}
                                <ul className="sidebar-menu">
                                    {section.items.map((item) => (
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

            {/* Floating tooltip — lives outside <aside> so it's never clipped.
                Hidden on mobile (tooltips aren't useful for touch targets). */}
            <div
                className={`sidebar-tooltip${tooltip.visible && !isMobile ? ' sidebar-tooltip--visible' : ''}`}
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
