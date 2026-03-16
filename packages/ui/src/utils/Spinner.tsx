'use client'

// ─── Spinner ──────────────────────────────────────────────────────────────────
// Retro amber loading indicator consistent with the R&B design system.
// Use size="lg" + fullArea for page-level loading states,
// size="md" + fullArea for section-level, size="sm" for inline contexts.

export type T_SpinnerSize = 'sm' | 'md' | 'lg'

interface I_SpinnerProps {
    size?: T_SpinnerSize
    /** Expand to fill the available space — centres the spinner in a large area */
    fullArea?: boolean
    label?: string
}

export function Spinner({
    size = 'md',
    fullArea = false,
    label = 'Loading…',
}: I_SpinnerProps) {
    return (
        <div
            className={[
                'spinner-wrapper',
                fullArea && 'spinner-wrapper--full',
            ]
                .filter(Boolean)
                .join(' ')}
            role="status"
            aria-label={label}
        >
            <div className={`spinner spinner--${size}`} aria-hidden="true" />
            <span className="spinner-label" aria-hidden="true">
                {label}
            </span>
        </div>
    )
}
