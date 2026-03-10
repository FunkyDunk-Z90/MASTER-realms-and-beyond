import { RefObject, MouseEvent, ChangeEvent } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type T_ButtonEvent =
    | MouseEvent<HTMLButtonElement>
    | ChangeEvent<HTMLButtonElement>
type T_BtnTypes = 'button' | 'reset' | 'submit'

/** Regal Fantasy variants + semantic utility variants */
export type T_BtnVariant =
    | 'gold'
    | 'royal'
    | 'crimson'
    | 'parchment'
    | 'ghost'
    | 'outline'
    | 'accent'
    | 'danger'
    | 'warning'
    | 'submit'
    | 'success'

/** Size modifier */
export type T_BtnSize = 'sm' | 'md' | 'lg'

type T_BtnRef = RefObject<HTMLButtonElement | null>

export interface I_ButtonProps {
    children: React.ReactNode
    variant?: T_BtnVariant
    size?: T_BtnSize
    leftOrnament?: string
    rightOrnament?: string
    isLoading?: boolean
    handleClick?: (e?: T_ButtonEvent) => void
    onClick?: (e?: T_ButtonEvent) => void
    isDisabled?: boolean
    disabled?: boolean
    btnType?: T_BtnTypes
    withRef?: T_BtnRef
    className?: string
    [key: string]: unknown
}

// ─── Button ───────────────────────────────────────────────────────────────────

export const Button = ({
    children,
    variant,
    size,
    leftOrnament,
    rightOrnament,
    isLoading,
    handleClick,
    onClick,
    isDisabled,
    disabled,
    btnType = 'button',
    withRef,
    className = '',
    ...rest
}: I_ButtonProps) => {
    const isDisabledFinal = isDisabled || disabled || isLoading

    // Regal BEM variants use btn--* class; semantic variants use flat class
    const regalVariants = new Set(['gold', 'royal', 'crimson', 'parchment'])
    const variantClass = variant
        ? regalVariants.has(variant)
            ? `btn--${variant}`
            : variant
        : '' // default to royal

    const sizeClass = size
        ? size === 'md'
            ? 'btn--md'
            : `btn--${size} btn-${size}`
        : ''

    const classes = [
        'btn',
        variantClass,
        sizeClass,
        isDisabledFinal ? 'disabled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            suppressHydrationWarning
            onClick={handleClick ?? onClick}
            disabled={isDisabledFinal}
            className={classes}
            type={btnType}
            ref={withRef}
            role="button"
            {...rest}
        >
            {isLoading && (
                <span className="btn__spinner" aria-hidden="true">
                    ⏳
                </span>
            )}
            {leftOrnament && !isLoading && (
                <span className="btn__ornament" aria-hidden="true">
                    {leftOrnament}
                </span>
            )}
            {children}
            {rightOrnament && (
                <span className="btn__ornament" aria-hidden="true">
                    {rightOrnament}
                </span>
            )}
        </button>
    )
}

// ─── Icon Button ──────────────────────────────────────────────────────────────

export interface I_IconButtonProps {
    icon: string
    label: string
    variant?: T_BtnVariant
    onClick?: () => void
    className?: string
    [key: string]: unknown
}

export const IconButton = ({
    icon,
    label,
    variant,
    onClick,
    className = '',
    ...rest
}: I_IconButtonProps) => (
    <button
        aria-label={label}
        className={[
            'btn',
            'btn--icon',
            variant ? `btn--${variant}` : '',
            className,
        ]
            .filter(Boolean)
            .join(' ')}
        onClick={onClick}
        type="button"
        {...rest}
    >
        <span aria-hidden="true">{icon}</span>
    </button>
)
