import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

type ValidateTarget = 'body' | 'query' | 'params'

/**
 * Express middleware that validates req[target] against a Zod schema.
 *
 * Express 5 makes req.query a read-only getter so we cannot reassign it.
 * Instead the parsed (coerced) value is stored on res.locals.validated[target]
 * and route handlers should read from there:
 *
 *   const query = res.locals.validated.query as AuthorizeQuery
 *   const body  = res.locals.validated.body  as LoginBody
 *
 * On failure returns 400 with structured Zod error details.
 */
export function validate<T extends z.ZodTypeAny>(
    schema: T,
    target: ValidateTarget = 'body',
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[target])

        if (!result.success) {
            res.status(400).json({
                error: 'validation_error',
                issues: result.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            })
            return
        }

        // Store on res.locals — avoids the Express 5 read-only req.query restriction
        if (!res.locals.validated) res.locals.validated = {}
        res.locals.validated[target] = result.data
        next()
    }
}
