'use client'

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    type MouseEvent,
} from 'react'

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

const hasChildren = (option: I_DropdownOption): boolean =>
    Array.isArray(option.children) && option.children.length > 0

function flattenOptions(options: I_DropdownOption[]): I_DropdownOption[] {
    const result: I_DropdownOption[] = []

    const walk = (opts: I_DropdownOption[]) => {
        for (const o of opts) {
            result.push(o)
            if (o.children && o.children.length) {
                walk(o.children)
            }
        }
    }

    walk(options)
    return result
}

function filterOptionsBySearch(
    options: I_DropdownOption[],
    term: string
): I_DropdownOption[] {
    if (!term) return options

    const lcTerm = term.toLowerCase()

    const walk = (opts: I_DropdownOption[]): I_DropdownOption[] => {
        const matched: I_DropdownOption[] = []

        for (const o of opts) {
            const labelMatch = o.label.toLowerCase().includes(lcTerm)
            const children = o.children ? walk(o.children) : []

            if (labelMatch || children.length > 0) {
                matched.push({
                    ...o,
                    children: children.length > 0 ? children : o.children,
                })
            }
        }

        return matched
    }

    return walk(options)
}

interface I_DropdownMenuProps {
    options: I_DropdownOption[]
    depth: number
    selectedValue?: string
    onSelect: (option: I_DropdownOption) => void
    openOnHover?: boolean
    renderOption?: I_DropdownProps['renderOption']
}

const DropdownMenu: React.FC<I_DropdownMenuProps> = ({
    options,
    depth,
    selectedValue,
    onSelect,
    openOnHover,
    renderOption,
}) => {
    const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null)

    const handleClick = (option: I_DropdownOption, event: MouseEvent) => {
        event.stopPropagation()

        if (hasChildren(option)) {
            setOpenSubmenuId((current) =>
                current === option.id ? null : option.id
            )
            return
        }

        if (!option.disabled) {
            onSelect(option)
        }
    }

    const handleMouseEnter = (option: I_DropdownOption) => {
        if (!openOnHover) return

        if (hasChildren(option)) {
            setOpenSubmenuId(option.id)
        } else {
            setOpenSubmenuId(null)
        }
    }

    return (
        <ul role="menu">
            {options.map((option) => {
                const isSelected =
                    !!option.value &&
                    option.value === selectedValue &&
                    !hasChildren(option)
                const isOpen = openSubmenuId === option.id
                const children = option.children ?? []

                const content =
                    renderOption?.(option, isSelected, depth) ?? option.label

                return (
                    <li
                        key={option.id}
                        role="menuitem"
                        aria-haspopup={hasChildren(option) || undefined}
                        aria-expanded={hasChildren(option) ? isOpen : undefined}
                        aria-disabled={option.disabled || undefined}
                        onClick={(event) => handleClick(option, event)}
                        onMouseEnter={() => handleMouseEnter(option)}
                    >
                        {content}

                        {hasChildren(option) && isOpen && (
                            <DropdownMenu
                                options={children}
                                depth={depth + 1}
                                selectedValue={selectedValue}
                                onSelect={onSelect}
                                openOnHover={openOnHover}
                                renderOption={renderOption}
                            />
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

export const Dropdown: React.FC<I_DropdownProps> = ({
    options,
    selectedValue,
    placeholder = 'Select…',
    disabled,
    closeOnSelect = true,
    searchable = false,
    openOnHover = false,
    onChange,
    renderOption,
    id,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const rootRef = useRef<HTMLDivElement | null>(null)

    const toggleOpen = () => {
        if (disabled) return
        setIsOpen((prev) => !prev)
    }

    const closeMenu = useCallback(() => {
        setIsOpen(false)
    }, [])

    useEffect(() => {
        if (!isOpen) return

        const handler = (event: MouseEvent | globalThis.MouseEvent) => {
            if (
                rootRef.current &&
                event.target instanceof Node &&
                !rootRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        window.addEventListener('mousedown', handler)
        return () => window.removeEventListener('mousedown', handler)
    }, [isOpen])

    const handleSelect = (option: I_DropdownOption) => {
        if (!option.disabled && onChange) {
            onChange(option.value, option)
        }
        if (closeOnSelect) {
            closeMenu()
        }
    }

    const flatOptions = useMemo(() => flattenOptions(options), [options])

    const selectedOption = useMemo(
        () =>
            selectedValue
                ? flatOptions.find((o) => o.value === selectedValue)
                : undefined,
        [flatOptions, selectedValue]
    )

    const visibleOptions = useMemo(
        () => (searchable ? filterOptionsBySearch(options, search) : options),
        [options, searchable, search]
    )

    return (
        <div ref={rootRef} id={id} className="dropdown-wrapper">
            <button
                type="button"
                onClick={toggleOpen}
                disabled={disabled}
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                <span>{selectedOption?.label ?? placeholder}</span>
                {children ?? <span>▾</span>}
            </button>

            {isOpen && (
                <div>
                    {searchable && (
                        <div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search…"
                            />
                        </div>
                    )}

                    <DropdownMenu
                        options={visibleOptions}
                        depth={0}
                        selectedValue={selectedValue}
                        onSelect={handleSelect}
                        openOnHover={openOnHover}
                        renderOption={renderOption}
                    />
                </div>
            )}
        </div>
    )
}
