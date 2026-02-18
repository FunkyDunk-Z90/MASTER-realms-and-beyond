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

type T_BtnRef = RefObject<HTMLButtonElement>

interface I_ButtonProps {
    children: React.ReactNode
    handleClick?: (e?: T_ButtonEvent | undefined) => void
    isDisabled?: boolean
    theme?: T_BtnTheme
    btnType?: T_BtnTypes
    withRef?: T_BtnRef
}

export default function Button({
    children,
    handleClick,
    isDisabled,
    theme,
    btnType,
    withRef,
}: I_ButtonProps) {
    const btnTheme = !theme ? '' : theme
    const defaultBtnType = !btnType ? 'button' : btnType

    return (
        <button
            suppressHydrationWarning
            onClick={handleClick}
            disabled={isDisabled}
            className={`btn ${!isDisabled ? btnTheme : 'disabled'}`}
            type={defaultBtnType}
            ref={withRef}
            role="button"
        >
            {children}
        </button>
    )
}
