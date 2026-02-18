import { Response } from 'express'

export const clearCookie = (res: Response, cookieName: string): void => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        expires: new Date(0),
    })
}
