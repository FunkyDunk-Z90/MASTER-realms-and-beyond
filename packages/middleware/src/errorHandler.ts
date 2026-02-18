import { Request, Response, NextFunction } from 'express'
import { AppError } from '@rnb/errors'

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.field && { field: err.field }),
        })
        return
    }

    console.error('UNHANDLED ERROR:', err)

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.',
    })
}
