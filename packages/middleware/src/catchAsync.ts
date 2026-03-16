import { Request, Response, NextFunction, RequestHandler } from 'express'

export const catchAsync = <
    P = Record<string, string>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Record<string, string>
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction
    ) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
    (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction
    ) =>
        fn(req, res, next).catch(next)
