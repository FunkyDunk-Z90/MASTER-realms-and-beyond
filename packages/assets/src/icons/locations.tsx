import type { SVGProps } from 'react'

export const svgLocations = (props: SVGProps<SVGSVGElement>) => (
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
        {/* Map pin outline */}
        <path d="M12 22l-5.5-7.5C5 12.5 4.5 10.8 4.5 9.5 4.5 5.4 7.9 2 12 2s7.5 3.4 7.5 7.5c0 1.3-.5 3-2 5L12 22z" />
        {/* Left tower */}
        <rect x={8} y={7} width={2.5} height={5} rx={0.3} />
        <path d="M8 7h.7v-.8h1v.8h.8" />
        {/* Right tower */}
        <rect x={13.5} y={7} width={2.5} height={5} rx={0.3} />
        <path d="M13.5 7h.7v-.8h1v.8h.8" />
        {/* Center wall */}
        <rect x={10.5} y={8.5} width={3} height={3.5} rx={0.2} />
        {/* Gate */}
        <path d="M11.2 12v-1.5a.8.8 0 0 1 1.6 0V12" />
        {/* Base */}
        <path d="M8 12h8" />
    </svg>
)
