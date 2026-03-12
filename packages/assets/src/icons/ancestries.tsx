import type { SVGProps } from 'react'

export const svgAncestries = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* Three silhouette heads representing different ancestries */}
        <circle cx={12} cy={7} r={3.5} />
        <path d="M12 10.5c-3.5 0-6.5 2-6.5 5v1.5h13v-1.5c0-3-3-5-6.5-5z" />
        {/* Pointed ear (elf) left */}
        <path d="M5.5 8.5L3 5l1.5 4" />
        {/* Horns (tiefling/orc) right */}
        <path d="M18.5 8.5L21 5l-1.5 4" />
        {/* DNA/heritage swirl below */}
        <path d="M8 20c1.5-1 2.5 1 4 0s2.5 1 4 0" strokeWidth={1.2} />
    </svg>
)
