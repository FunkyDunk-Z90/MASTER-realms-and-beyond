class AppError extends Error {
    public statusCode: number
    public status: string
    public isOperational: boolean
    public field?: string

    constructor(message: string, statusCode: number, field?: string) {
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true
        this.field = field

        const ErrorWithStack = Error as typeof Error & {
            captureStackTrace?: (target: object, constructor: Function) => void
        }

        if (ErrorWithStack.captureStackTrace) {
            ErrorWithStack.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError
