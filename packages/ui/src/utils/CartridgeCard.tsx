'use client'

import React from 'react'
import Link from 'next/link'

export interface I_CartridgeCardProps {
    /** Game/content title shown on the label */
    title: string
    /** Subtitle or genre shown below the title */
    subtitle?: string
    /** Short description shown on the label body */
    description?: string
    /** Platform strip text at the top (e.g. "GAME BOY", "GBA") */
    platform?: string
    /** Small badge text shown top-left of label (e.g. "★ RPG") */
    badge?: string
    /** Tag shown bottom-right of label (e.g. "v1.2") */
    tag?: string
    /** Accent color for the label area (CSS color string) */
    accentColor?: string
    /** If provided, wraps the card in a link */
    href?: string
    /** Click handler (ignored when href is provided) */
    onClick?: () => void
    /** Size variant */
    size?: 'sm' | 'md' | 'lg'
    /** Additional class on the root element */
    className?: string
}

export const CartridgeCard = ({
    title,
    subtitle,
    description,
    platform = 'GAME BOY',
    badge,
    tag,
    accentColor,
    href,
    onClick,
    size = 'md',
    className = '',
}: I_CartridgeCardProps) => {
    const style = accentColor
        ? ({ '--cartridge-accent': accentColor } as React.CSSProperties)
        : undefined

    const inner = (
        <div
            className={`cartridge-card cartridge-card--${size}${className ? ' ' + className : ''}`}
            style={style}
            onClick={!href ? onClick : undefined}
            role={!href && onClick ? 'button' : undefined}
            tabIndex={!href && onClick ? 0 : undefined}
        >
            {/* Top platform strip */}
            <div className="cartridge-top">
                <span className="cartridge-platform">{platform}</span>
                <span className="cartridge-logo">®</span>
            </div>

            {/* Main label sticker */}
            <div className="cartridge-label">
                {badge && <span className="cartridge-badge">{badge}</span>}
                <h3 className="cartridge-title">{title}</h3>
                {subtitle && <p className="cartridge-subtitle">{subtitle}</p>}
                {description && <p className="cartridge-description">{description}</p>}
                {tag && <span className="cartridge-tag">{tag}</span>}
            </div>

            {/* Connector pin strip at the bottom */}
            <div className="cartridge-connector">
                {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className="cartridge-pin" />
                ))}
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="cartridge-card-link">
                {inner}
            </Link>
        )
    }

    return inner
}
