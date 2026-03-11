import { Schema } from 'mongoose'

export function idTransformPlugin(schema: Schema) {
    const transform = (_: any, ret: any) => {
        if (ret._id) {
            ret.id = ret._id.toString()
            delete ret._id
        }

        delete ret.__v
        return ret
    }

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform,
    })

    schema.set('toObject', {
        virtuals: true,
        versionKey: false,
        transform,
    })
}
