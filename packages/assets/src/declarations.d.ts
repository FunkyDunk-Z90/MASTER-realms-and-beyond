// Image type compatible with next/image StaticImageData — no next dependency needed.
type StaticImageData = {
    src: string
    height: number
    width: number
    blurDataURL?: string
    blurWidth?: number
    blurHeight?: number
}

declare module '*.png' {
    const content: StaticImageData
    export default content
}

declare module '*.jpg' {
    const content: StaticImageData
    export default content
}

declare module '*.jpeg' {
    const content: StaticImageData
    export default content
}

declare module '*.webp' {
    const content: StaticImageData
    export default content
}

declare module '*.gif' {
    const content: StaticImageData
    export default content
}

declare module '*.svg' {
    import * as React from 'react'
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    export default ReactComponent
}

declare module '*.ico' {
    const content: StaticImageData
    export default content
}
