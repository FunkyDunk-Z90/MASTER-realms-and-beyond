import type { SVGProps } from 'react'

export const svgBestiary = (props: SVGProps<SVGSVGElement>) => (
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
        {/* Dragon head profile */}
        <path d="M6 14c0-4 2-7 5-8.5C12.5 4.5 14 4 16 5c1.5.8 2.5 2.5 2.5 4.5 0 1.5-.5 3-2 4l-2 1.5" />
        {/* Snout */}
        <path d="M14.5 14.5L12 16l-2.5-1c-1.5-.5-2.5-1-3.5-1" />
        {/* Horn */}
        <path d="M15 5l2.5-2.5L16 6" />
        {/* Eye */}
        <circle cx={14} cy={9} r={1} fill="currentColor" />
        {/* Teeth */}
        <path d="M8 15l1-1.5 1 1.5 1-1.5 1 1.5" />
        {/* Neck/body */}
        <path d="M6 14c-1 1.5-1 3 0 4.5C7 20 9 21 12 21" />
        <path d="M14.5 14.5c1 1.5 1 3.5 0 5-.5.7-1.5 1.5-2.5 1.5" />
        {/* Wing hint */}
        <path d="M17 9.5c1.5-.5 3 0 4 1.5" />
        <path d="M18 12c1-.5 2-.5 3 0" />
    </svg>
)
