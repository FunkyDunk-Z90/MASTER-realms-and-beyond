import type { SVGProps } from 'react'

export const svgCampaigns = (props: SVGProps<SVGSVGElement>) => (
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
        {/* Banner/flag on pole */}
        <path d="M5 3v18" />
        <path d="M5 3h10l-2.5 3.5L15 10H5" />
        {/* Sword/campaign marker on banner */}
        <path d="M9 5v4" />
        <path d="M7.5 6.5h3" />
        {/* Map route dots */}
        <circle cx={14} cy={15} r={1} fill="currentColor" />
        <circle cx={17} cy={18} r={1} fill="currentColor" />
        <circle cx={20} cy={15.5} r={1} fill="currentColor" />
        {/* Dotted path between points */}
        <path d="M14.8 15.7l1.5 1.5" strokeDasharray="1.5 1" />
        <path d="M17.8 17.5l1.5-1.2" strokeDasharray="1.5 1" />
    </svg>
)
