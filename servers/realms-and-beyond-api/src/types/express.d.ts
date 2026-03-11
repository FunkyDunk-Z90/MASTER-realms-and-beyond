import type { I_IdentityDocument } from '../models/identityModel'

declare global {
    namespace Express {
        interface Request {
            identity?: I_IdentityDocument
        }
    }
}

export {}
