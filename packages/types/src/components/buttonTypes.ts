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

export interface I_ButtonProps {
    children: React.ReactNode
    handleClick?: (e?: T_ButtonEvent | undefined) => void
    isDisabled?: boolean
    theme?: T_BtnTheme
    btnType?: T_BtnTypes
    withRef?: T_BtnRef
}
