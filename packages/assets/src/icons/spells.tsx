import type { SVGProps } from 'react'

export const svgSpells = (props: SVGProps<SVGSVGElement>) => (
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
        {/* Magic circle */}
        <circle cx={12} cy={12} r={8} />
        <circle cx={12} cy={12} r={5.5} strokeDasharray="3 2" />
        {/* Inner rune star */}
        <path
            d="M12 6.5l1.8 3.5 3.7.5-2.7 2.7.7 3.8-3.5-1.8-3.5 1.8.7-3.8L6.5 10.5l3.7-.5z"
            strokeWidth={1.2}
        />
        {/* Sparkle accents */}
        <path
            d="M19 3l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z"
            strokeWidth={1}
        />
        <path
            d="M3 5l.3.7.7.3-.7.3-.3.7-.3-.7-.7-.3.7-.3z"
            strokeWidth={1}
        />
        <path
            d="M20 17l.3.7.7.3-.7.3-.3.7-.3-.7-.7-.3.7-.3z"
            strokeWidth={1}
        />
    </svg>
)
