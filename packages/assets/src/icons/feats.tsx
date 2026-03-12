import type { SVGProps } from 'react'

export const svgFeats = (props: SVGProps<SVGSVGElement>) => (
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
        {/* Raised fist */}
        <path d="M10 13V7.5a1 1 0 0 1 2 0V12" />
        <path d="M12 12V6.5a1 1 0 0 1 2 0V12" />
        <path d="M14 12V7.5a1 1 0 0 1 2 0V12" />
        <path d="M10 12V9.5a1 1 0 0 0-2 0V14c0 3 2 5.5 5 5.5s4.5-2 4.5-5V12" />
        {/* Power burst lines */}
        <path d="M5 6l2 1.5" />
        <path d="M4 10h2" />
        <path d="M5 14l1.5-1" />
        <path d="M19 6l-1 1" />
        <path d="M20 10h-1.5" />
        {/* Star/achievement spark */}
        <path
            d="M12 2l.5 1.5L14 3l-1 1 .5 1.5L12 5l-1.5.5L11 4l-1-1 1.5.5z"
            strokeWidth={1}
        />
    </svg>
)
