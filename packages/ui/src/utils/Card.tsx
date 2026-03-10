'use client'

import { MouseEvent, KeyboardEvent } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_CardVariant = 'dark' | 'parchment' | 'crimson' | 'relic' | 'glow' | 'inset'

export interface I_CardProps {
    variant?: T_CardVariant
    withCorners?: boolean
    className?: string
    children: React.ReactNode
    onClick?: () => void
}

export interface I_CardHeaderProps {
    eyebrow?: string
    title: string
    subtitle?: string
    badge?: string
    children?: React.ReactNode
}

// ─── Corner SVG flourish ──────────────────────────────────────────────────────

const CornerFlourish = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => (
    <svg
        className={`card__corner card__corner--${position}`}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M2 2 L10 2 M2 2 L2 10 M2 2 L6 6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        <circle cx="10" cy="2" r="0.8" fill="currentColor" opacity="0.6" />
        <circle cx="2" cy="10" r="0.8" fill="currentColor" opacity="0.6" />
    </svg>
)

// ─── Sub-components ───────────────────────────────────────────────────────────

export const CardHeader = ({ eyebrow, title, subtitle, badge, children }: I_CardHeaderProps) => (
    <div className="card__header">
        {eyebrow && <p className="card__eyebrow">{eyebrow}</p>}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <h3 className="card__title">{title}</h3>
            {badge && <span className="card__badge">{badge}</span>}
        </div>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        {children}
    </div>
)

export const CardDivider = ({ label = '✦' }: { label?: string }) => (
    <div className="card__divider">{label}</div>
)

export const CardBody = ({ children }: { children: React.ReactNode }) => (
    <div className="card__body">{children}</div>
)

export const CardFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="card__footer">{children}</div>
)

export const CardText = ({ children }: { children: React.ReactNode }) => (
    <p className="card__text">{children}</p>
)

// ─── Main Card ────────────────────────────────────────────────────────────────

export const Card = ({
    variant = 'dark',
    withCorners = true,
    className = '',
    children,
    onClick,
}: I_CardProps) => {
    const classes = [
        'card',
        `card--${variant}`,
        onClick ? 'card--clickable' : '',
        className,
    ].filter(Boolean).join(' ')

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (onClick && e.key === 'Enter') onClick()
    }

    return (
        <div
            className={classes}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? handleKeyDown : undefined}
        >
            {withCorners && (
                <>
                    <CornerFlourish position="tl" />
                    <CornerFlourish position="tr" />
                    <CornerFlourish position="bl" />
                    <CornerFlourish position="br" />
                </>
            )}
            {children}
        </div>
    )
}
