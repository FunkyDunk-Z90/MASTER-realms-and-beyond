import type { SVGProps } from 'react'

export const svgWorlds = (props: SVGProps<SVGSVGElement>) => (
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
        {/* Globe */}
        <circle cx={12} cy={12} r={8} />
        {/* Continent shapes / land masses */}
        <path d="M8 7c1 0 2 1 2 2s-1.5 1.5-2 2-1 2 0 3" />
        <path d="M14 6c1 .5 1.5 2 1 3s-1 1-2 1.5" />
        <path d="M13 15c1 0 2.5.5 3 1.5" />
        {/* Latitude line */}
        <ellipse cx={12} cy={12} rx={8} ry={3} />
        {/* Longitude line */}
        <ellipse cx={12} cy={12} rx={3} ry={8} />
        {/* Orbital ring */}
        <ellipse
            cx={12}
            cy={12}
            rx={11}
            ry={4}
            transform="rotate(-30 12 12)"
            strokeWidth={1}
            strokeDasharray="4 3"
        />
        {/* Moon */}
        <circle cx={20.5} cy={5} r={1.2} fill="currentColor" />
    </svg>
)
