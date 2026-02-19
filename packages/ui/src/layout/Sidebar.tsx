'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { I_Link } from '@rnb/types'

export type T_SidebarVariant = 'default' | 'compact'

export interface I_SidebarSection {
    title?: string
    items: I_Link[]
}

export interface I_SidebarProps {
    /** Array of nav sections. Each section can have an optional heading and a list of links. */
    sections: I_SidebarSection[]
    /** Controls the width mode. 'default' uses --sidebar-max, 'compact' uses --sidebar-min. */
    variant?: T_SidebarVariant
    /** When true the sidebar slides in as an overlay (mobile drawer behaviour). */
    isOpen?: boolean
    /** Callback fired when the sidebar requests to close (overlay mode). */
    onClose?: () => void
    /** Optional footer slot rendered at the bottom of the sidebar. */
    footer?: React.ReactNode
}

export const Sidebar = ({
    sections,
    variant = 'default',
    isOpen,
    onClose,
    footer,
}: I_SidebarProps) => {
    const pathName = usePathname()
    const sidebarRef = useRef<HTMLDivElement>(null)
    const isControlled = isOpen !== undefined

    const [internalOpen, setInternalOpen] = useState(true)
    const effectiveOpen = isControlled ? isOpen : internalOpen

    // Close on outside click in overlay mode
    useEffect(() => {
        if (!isControlled) return

        const handler = (e: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target as Node)
            ) {
                onClose?.()
            }
        }

        if (effectiveOpen) {
            document.addEventListener('mousedown', handler)
        }
        return () => document.removeEventListener('mousedown', handler)
    }, [effectiveOpen, isControlled, onClose])

    const openClass = isControlled
        ? effectiveOpen
            ? 'sidebar-overlay-open'
            : 'sidebar-overlay-closed'
        : ''

    return (
        <>
            {/* Backdrop for overlay mode */}
            {isControlled && effectiveOpen && (
                <div className="sidebar-backdrop" onClick={onClose} />
            )}

            <aside
                ref={sidebarRef}
                className={`sidebar-wrapper sidebar-${variant} ${isControlled ? 'sidebar-overlay' : ''} ${openClass}`}
            >
                {/* Collapse toggle for non-controlled (desktop) mode */}
                {!isControlled && (
                    <button
                        className="sidebar-collapse-btn"
                        onClick={() => setInternalOpen((p) => !p)}
                        aria-label={
                            internalOpen ? 'Collapse sidebar' : 'Expand sidebar'
                        }
                    >
                        <span
                            className={`sidebar-collapse-icon ${internalOpen ? 'open' : ''}`}
                        >
                            ›
                        </span>
                    </button>
                )}

                <nav className="sidebar-nav">
                    {sections.map((section, si) => (
                        <div key={si} className="sidebar-section">
                            {section.title && (
                                <p className="sidebar-section-title">
                                    {section.title}
                                </p>
                            )}
                            <ul className="sidebar-menu">
                                {section.items.map((item) => {
                                    const isActive = pathName === item.href
                                    return (
                                        <li
                                            key={item.id}
                                            className="sidebar-item"
                                        >
                                            <Link
                                                href={item.href}
                                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                                            >
                                                {item.icon && (
                                                    <span className="sidebar-icon">
                                                        {/* Icon passed as ReactNode via item.icon */}
                                                        {
                                                            item.icon as React.ReactNode
                                                        }
                                                    </span>
                                                )}
                                                <span className="sidebar-label">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {footer && <div className="sidebar-footer">{footer}</div>}
            </aside>
        </>
    )
}
