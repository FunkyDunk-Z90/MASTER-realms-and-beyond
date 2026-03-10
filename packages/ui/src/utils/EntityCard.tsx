'use client'

import Link from 'next/link'

export interface I_EntityCardProps {
    /** Display name shown on the card */
    name: string
    /** Full href for the "view" link */
    href: string
    /** Optional additional class on the <li> wrapper */
    className?: string
}

/**
 * EntityCard
 *
 * A minimal list-item card that shows an entity name and a link.
 * Use inside a <ul className="card-wrapper"> list.
 */
export const EntityCard = ({ name, href, className = '' }: I_EntityCardProps) => (
    <li className={`category-card-wrapper${className ? ' ' + className : ''}`}>
        <p>{name}</p>
        <Link className="card-link" href={href}>
            view
        </Link>
    </li>
)
