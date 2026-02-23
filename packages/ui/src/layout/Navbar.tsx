'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image, { StaticImageData } from 'next/image'
import { I_Link } from '@rnb/types'
import BurgerIcon from '../utils/BurgerIcon'

interface I_NavbarProps {
    navItems: I_Link[]
    headerTitle: string
    headerIcon: string | StaticImageData
}

const MOBILE_BREAKPOINT = 1025

export const Navbar = ({
    navItems,
    headerTitle,
    headerIcon,
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
                <Image src={headerIcon} alt="icon" height={30} width={30} />
                <h1 className="header-title">{headerTitle}</h1>
                <BurgerIcon isActive={isOpen} toggle={toggleNav} />
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
                </nav>
            </header>
        </>
    )
}
