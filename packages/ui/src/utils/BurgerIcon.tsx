interface I_BurgerIconProps {
    isActive: boolean
    toggle: () => void
}

export default function BurgerIcon({ isActive, toggle }: I_BurgerIconProps) {
    return (
        <div
            className={`burgerIcon ${isActive ? 'active' : ''} `}
            onClick={toggle}
        >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
        </div>
    )
}
