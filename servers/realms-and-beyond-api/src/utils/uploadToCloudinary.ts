import { AppError } from '@rnb/errors'
import cloudinary from '../config/cloudinary'

interface I_UploadOptions {
    folder?: string
    publicId?: string
    transformation?: object
}

interface I_UploadResult {
    url: string
    publicId: string
}

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    options: I_UploadOptions = {}
): Promise<I_UploadResult> =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder ?? 'realms-and-beyond',
                public_id: options.publicId,
                transformation: options.transformation,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error || !result) {
                    reject(new AppError('Image upload failed', 500))
                    return
                }
                resolve({ url: result.secure_url, publicId: result.public_id })
            }
        )
        stream.end(fileBuffer)
    })
