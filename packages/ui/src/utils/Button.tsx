import { RefObject, MouseEvent, ChangeEvent } from 'react'

type T_ButtonEvent =
    | MouseEvent<HTMLButtonElement>
    | ChangeEvent<HTMLButtonElement>

type T_BtnTypes = 'button' | 'reset' | 'submit'

type T_BtnTheme =
    | 'accent'
    | 'warning'
    | 'danger'
    | 'submit'
    | 'success'
    | 'disabled'

/** Visual style variant applied alongside the colour theme. */
type T_BtnVariant = 'ghost' | 'outline'

/** Size modifier — maps to btn-sm / btn-lg CSS classes. */
type T_BtnSize = 'sm' | 'lg'

type T_BtnRef = RefObject<HTMLButtonElement | null>

export interface I_ButtonProps {
    children: React.ReactNode
    handleClick?: (e?: T_ButtonEvent | undefined) => void
    isDisabled?: boolean
    theme?: T_BtnTheme
    variant?: T_BtnVariant
    size?: T_BtnSize
    btnType?: T_BtnTypes
    withRef?: T_BtnRef
    className?: string
    [key: string]: unknown
}

export const Button = ({
    children,
    handleClick,
    isDisabled,
    theme,
    variant,
    size,
    btnType = 'button',
    withRef,
    className = '',
    ...rest
}: I_ButtonProps) => {
    const classes = [
        'btn',
        isDisabled ? 'disabled' : (theme ?? ''),
        variant ?? '',
        size ? `btn-${size}` : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            suppressHydrationWarning
            onClick={handleClick}
            disabled={isDisabled}
            className={classes}
            type={btnType}
            ref={withRef}
            role="button"
            {...rest}
        >
            {children}
        </button>
    )
}
