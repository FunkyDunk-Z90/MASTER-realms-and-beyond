import { Request, Response, NextFunction } from 'express'

type T_AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>

export const catchAsync =
    (fn: T_AsyncController): T_AsyncController =>
    (req, res, next) =>
        fn(req, res, next).catch(next)
