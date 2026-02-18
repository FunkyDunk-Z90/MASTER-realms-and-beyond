import { ReactNode } from 'react'

export interface I_DropdownOption {
    id: string
    label: string
    value?: string
    description?: string
    iconName?: string
    disabled?: boolean
    children?: I_DropdownOption[]
}

export type T_DropdownPlacement =
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'

export interface I_DropdownProps {
    options: I_DropdownOption[]
    selectedValue?: string
    placeholder?: string
    disabled?: boolean
    id?: string
    children?: ReactNode

    placement?: T_DropdownPlacement
    closeOnSelect?: boolean
    searchable?: boolean
    openOnHover?: boolean

    onChange?: (value: string | undefined, option: I_DropdownOption) => void

    renderOption?: (
        option: I_DropdownOption,
        isSelected: boolean,
        depth: number
    ) => React.ReactNode
}
