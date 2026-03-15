'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image, { StaticImageData } from 'next/image'
import { I_Link } from '@rnb/types'
import BurgerIcon from '../utils/BurgerIcon'
import { ThemeSwitcher } from '../context/ThemeSwitcher'

interface I_NavbarProps {
    navItems: I_Link[]
    headerTitle: string
    headerIcon?: string | StaticImageData
    /** Optional — when provided, a Log Out button is rendered in the nav. */
    onLogout?: () => void
}

const MOBILE_BREAKPOINT = 1025

export const Navbar = ({
    navItems,
    headerTitle,
    headerIcon,
    onLogout,
}: I_NavbarProps) => {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const hasToggled = useRef<boolean>(false)
    const navRef = useRef<HTMLDivElement>(null)
    const pathName = usePathname()

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT
            setIsMobile(mobile)
            if (!mobile) {
                setIsOpen(false)
                hasToggled.current = false
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                if (isOpen) {
                    hasToggled.current = true
                    setIsOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const toggleNav = () => {
        if (isMobile) {
            hasToggled.current = true
            setIsOpen((prev) => !prev)
        }
    }

    const closeNav = () => {
        if (isMobile) setIsOpen(false)
    }

    const menuClass = `nav-wrapper${isMobile ? (hasToggled.current ? (isOpen ? ' opened' : ' closed') : '') : ''}`

    return (
        <>
            <div className="header-spacer" />
            <header className="header-wrapper" ref={navRef}>
                {headerIcon && (
                    <div className="header-logo">
                        <Image
                            src={headerIcon}
                            alt="icon"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                )}

                <h1 className="header-title">{headerTitle}</h1>

                {/* ── Slide-in nav (links + logout on mobile/desktop) ── */}
                <nav className={menuClass}>
                    <ul className="nav-menu">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.id} id={item.id}>
                                <Link
                                    className={`nav-link${pathName === item.href ? ' active' : ''}`}
                                    href={item.href}
                                    onClick={() => closeNav()}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {onLogout && (
                        <button
                            className="nav-logout"
                            onClick={() => {
                                closeNav()
                                onLogout()
                            }}
                        >
                            Log Out
                        </button>
                    )}
                </nav>

                {/* ── Persistent header actions (theme toggle, always visible) ── */}
                <div className="nav-actions">
                    <ThemeSwitcher
                        showThemePicker={false}
                        showModePicker={false}
                        showThemeToggle={true}
                    />
                </div>

                <BurgerIcon isActive={isOpen} toggle={toggleNav} />
            </header>
        </>
    )
}
