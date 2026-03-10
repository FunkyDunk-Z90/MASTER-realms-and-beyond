'use client'

// ─── Frame ────────────────────────────────────────────────────────────────────

export type T_FrameVariant = 'portrait' | 'scroll' | 'crest'

const FLOURISH_CHARS = ['✦', '◆', '✦', '◆']

export interface I_FrameProps {
    variant?: T_FrameVariant
    className?: string
    children: React.ReactNode
}

export const Frame = ({ variant = 'crest', className = '', children }: I_FrameProps) => (
    <div className={`frame frame--${variant}${className ? ` ${className}` : ''}`}>
        {(['tl', 'tr', 'bl', 'br'] as const).map((pos, i) => (
            <span key={pos} className={`frame__flourish frame__flourish--${pos}`} aria-hidden="true">
                {FLOURISH_CHARS[i]}
            </span>
        ))}
        <div className="frame__inner">{children}</div>
    </div>
)

// ─── Panel ────────────────────────────────────────────────────────────────────

export type T_PanelVariant = 'dark' | 'parchment' | 'ornate'

export interface I_PanelProps {
    variant?: T_PanelVariant
    title?: string
    className?: string
    children: React.ReactNode
}

export const Panel = ({ variant = 'dark', title, className = '', children }: I_PanelProps) => (
    <section className={`panel panel--${variant}${className ? ` ${className}` : ''}`}>
        {title && <h2 className="panel__title">{title}</h2>}
        {children}
    </section>
)

// ─── Divider ──────────────────────────────────────────────────────────────────

export interface I_DividerProps {
    ornament?: string
    plain?: boolean
    className?: string
}

export const Divider = ({ ornament = '◆', plain = false, className = '' }: I_DividerProps) => (
    <div
        className={`divider${plain ? ' divider--plain' : ''}${className ? ` ${className}` : ''}`}
        role="separator"
    >
        {!plain && (
            <span className="divider__ornament" aria-hidden="true">{ornament}</span>
        )}
    </div>
)

// ─── Stat block ───────────────────────────────────────────────────────────────

export interface I_Stat {
    value: string | number
    label: string
}

export interface I_StatBlockProps {
    stats: I_Stat[]
    className?: string
}

export const StatBlock = ({ stats, className = '' }: I_StatBlockProps) => (
    <div className={`stat-block${className ? ` ${className}` : ''}`}>
        {stats.map((stat, i) => (
            <div key={i} className="stat-block__item">
                <span className="stat-block__value">{stat.value}</span>
                <span className="stat-block__label">{stat.label}</span>
            </div>
        ))}
    </div>
)

// ─── Seal ─────────────────────────────────────────────────────────────────────

export type T_SealVariant = 'gold' | 'silver' | 'crimson' | 'emerald'

export interface I_SealProps {
    variant?: T_SealVariant
    icon?: string
    className?: string
    children: React.ReactNode
}

export const Seal = ({ variant = 'gold', icon, className = '', children }: I_SealProps) => (
    <span className={`seal seal--${variant}${className ? ` ${className}` : ''}`}>
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
    </span>
)

// ─── Toast ────────────────────────────────────────────────────────────────────

export type T_ToastVariant = 'decree' | 'warning' | 'danger'

export interface I_ToastProps {
    variant?: T_ToastVariant
    icon?: string
    title?: string
    message: string
    className?: string
}

const DEFAULT_ICONS: Record<T_ToastVariant, string> = {
    decree:  '📜',
    warning: '⚠',
    danger:  '☠',
}

export const Toast = ({ variant = 'decree', icon, title, message, className = '' }: I_ToastProps) => (
    <div
        className={`toast toast--${variant}${className ? ` ${className}` : ''}`}
        role="alert"
    >
        <span className="toast__icon" aria-hidden="true">
            {icon ?? DEFAULT_ICONS[variant]}
        </span>
        <div className="toast__text">
            {title && <strong>{title}</strong>}
            {message}
        </div>
    </div>
)
