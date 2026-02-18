import { Request, Response } from 'express'
import { Resend } from 'resend'
import { env } from '@rnb/validators'

const resend = new Resend(env.RESEND_API_KEY)

const sendMail = async (req: Request, res: Response) => {
    const { data, error } = await resend.emails.send({
        from: 'Duncan <onboarding@realmsandbeyond.com>',
        to: ['delivered@resend.dev'],
        subject: 'validate email',
        html: '<strong>it works!</strong>',
    })

    if (error) {
        return res.status(400).json({ error })
    }

    res.status(200).json({ data })
}

export { sendMail }
