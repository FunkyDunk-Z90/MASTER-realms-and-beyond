import { Model, Document } from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '@rnb/errors'
import { catchAsync } from './catchAsync'

// ─── Base Document Interface ──────────────────────────────────────────────────

interface I_BaseDoc extends Document {
    toClient(): unknown
}

// ─── Create One ───────────────────────────────────────────────────────────────

export const createOne = <T extends I_BaseDoc>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.create(req.body)

        if (!doc) {
            throw new AppError('No document created', 404)
        }

        res.status(201).json({
            status: 'success',
            doc,
        })
    })

// ─── Get All ──────────────────────────────────────────────────────────────────

export const getAll = <T extends I_BaseDoc>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const docs = await Model.find().select('-password')

        if (!docs || docs.length === 0) {
            throw new AppError('No documents found', 404)
        }

        res.status(200).json({
            status: 'success',
            results: docs.length,
            docs: docs.map((doc) => doc.toClient()),
        })
    })

// ─── Get One ──────────────────────────────────────────────────────────────────

export const getOne = <T extends I_BaseDoc>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.findById(req.params.id).select('-password')

        if (!doc) {
            throw new AppError('No document found with that ID', 404)
        }

        res.status(200).json({
            status: 'success',
            doc: doc.toClient(),
        })
    })

// ─── Update One ───────────────────────────────────────────────────────────────

export const updateOne = <T extends I_BaseDoc>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password')

        if (!doc) {
            throw new AppError('No document found with that ID', 404)
        }

        await doc.save({ validateModifiedOnly: true })

        res.status(200).json({
            status: 'success',
            doc: doc.toClient(),
        })
    })

// ─── Update Many ──────────────────────────────────────────────────────────────

export const updateMany = <T extends I_BaseDoc>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const updates: { id: string; fields: Record<string, unknown> }[] =
            req.body.updates

        if (!Array.isArray(updates) || updates.length === 0) {
            throw new AppError('No updates provided', 400)
        }

        const bulkOps = updates.map(({ id, fields }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: fields },
            },
        }))

        const bulkWriteResult = await Model.bulkWrite(bulkOps as any[])

        if (bulkWriteResult.modifiedCount === 0) {
            throw new AppError('No documents were updated', 400)
        }

        const updatedDocs = await Model.find({
            _id: { $in: updates.map(({ id }) => id) },
        })

        res.status(200).json({
            status: 'success',
            results: updatedDocs.length,
            docs: updatedDocs,
        })
    })

// ─── Delete One ───────────────────────────────────────────────────────────────

export const deleteOne = <T extends Document>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.findByIdAndDelete(req.params.id)

        if (!doc) {
            throw new AppError('No document found with that ID', 404)
        }

        res.status(204).json({
            status: 'success',
            doc: null,
        })
    })
