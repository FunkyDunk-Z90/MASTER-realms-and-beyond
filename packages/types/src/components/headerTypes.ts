import { StaticImageData } from 'next/image'
import { I_Link } from '../globalTypes'
import { I_Identity } from '../models/users/identityTypes'

export interface I_HeaderProps {
    companyBanner?: StaticImageData
    companyLogo?: StaticImageData
    companyName: string
    rootLink?: string
    navbarItems: I_Link[]
    hasAuth: I_Identity | null
}
