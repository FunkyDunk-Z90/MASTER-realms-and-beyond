'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { I_Link } from '@rnb/types'

const STORAGE_KEY = 'sidebar-open'

export interface I_SidebarItem extends I_Link {
    children?: I_SidebarItem[]
}

export interface I_SidebarSection {
    title?: string
    items: I_SidebarItem[]
}

export interface I_SidebarProps {
    sections: I_SidebarSection[]
    footer?: React.ReactNode
}

interface I_SidebarMenuItemProps {
    item: I_SidebarItem
    pathName: string
    sidebarOpen: boolean
    depth?: number
}

const SidebarMenuItem = ({
    item,
    pathName,
    sidebarOpen,
    depth = 0,
}: I_SidebarMenuItemProps) => {
    const hasChildren = item.children && item.children.length > 0

    // Auto-expand if a child route is active
    const isChildActive = (items: I_SidebarItem[]): boolean =>
        items.some(
            (child) =>
                pathName === child.href ||
                (child.children && isChildActive(child.children))
        )

    const [expanded, setExpanded] = useState<boolean | undefined>(
        () => hasChildren && isChildActive(item.children!)
    )

    const isActive = pathName === item.href

    const handleToggle = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.preventDefault()
            setExpanded((prev) => !prev)
        }
    }

    return (
        <li
            className={`sidebar-item ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''} ${depth > 0 ? 'sidebar-item--nested' : ''}`}
            style={{ '--depth': depth } as React.CSSProperties}
        >
            <Link
                href={hasChildren ? '#' : item.href}
                className={`sidebar-link ${hasChildren ? 'sidebar-link--parent' : ''}`}
                onClick={hasChildren ? handleToggle : undefined}
                aria-expanded={hasChildren ? expanded : undefined}
            >
                <span className="sidebar-label">{item.label}</span>

                {hasChildren && sidebarOpen && (
                    <span
                        className={`sidebar-chevron ${expanded ? 'expanded' : ''}`}
                        aria-hidden="true"
                    >
                        ›
                    </span>
                )}
            </Link>

            {hasChildren && (
                <div
                    className={`sidebar-submenu ${expanded ? 'sidebar-submenu--open' : ''}`}
                >
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

export const Sidebar = ({ sections, footer }: I_SidebarProps) => {
    const pathName = usePathname()
    const [open, setOpen] = useState<boolean | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        setOpen(stored === null ? false : stored === 'true')
    }, [])

    const toggle = () => {
        const next = !open
        setOpen(next)
        localStorage.setItem(STORAGE_KEY, String(next))
    }

    if (open === null) return null

    return (
        <aside
            className={`sidebar-wrapper ${open ? 'sidebar-open' : 'sidebar-collapsed'}`}
        >
            <button
                className="sidebar-collapse-btn"
                onClick={toggle}
                aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                <span className={`sidebar-collapse-icon ${open ? 'open' : ''}`}>
                    ›
                </span>
            </button>

            <nav className="sidebar-nav">
                {sections.map((section, i) => (
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
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {footer && <div className="sidebar-footer">{footer}</div>}
        </aside>
    )
}
