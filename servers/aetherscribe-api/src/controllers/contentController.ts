import { Request, Response } from 'express'
import { Model, Types } from 'mongoose'
import { ZodType } from 'zod'
import { AetherscribeProfile, Codex } from '@rnb/database'
import { AppError } from '@rnb/errors'
import { catchAsync } from '@rnb/middleware'
import { slugify } from '../utils/slugify'

// ─── Recent helper ────────────────────────────────────────────────────────────
// Maintains the codex recent[] array: remove stale entry, prepend new, trim to 5.

async function syncCodexRecent(
    codexId: Types.ObjectId | string,
    docId: Types.ObjectId,
    category: string,
    name: string
): Promise<void> {
    const entry = { docId, category, name, updatedAt: new Date() }

    // Remove any existing entry for this doc, then prepend the fresh one.
    await Codex.findByIdAndUpdate(codexId, {
        $pull: { recent: { docId } },
    })
    await Codex.findByIdAndUpdate(codexId, {
        $push: {
            recent: {
                $each: [entry],
                $position: 0,
                $slice: 5,
            },
        },
    })
}

// ─── Generic CRUD factory ─────────────────────────────────────────────────────
// Returns a set of Express handlers for a content model.
// `category` must match the field name in Codex.content (e.g. 'worlds', 'npcs').

export function createContentControllers<
    TDoc extends { toClient(): Record<string, unknown> },
>(
    ContentModel: Model<TDoc>,
    createSchema: ZodType,
    updateSchema: ZodType,
    category: string
) {
    // ── List ─────────────────────────────────────────────────────────────────
    // GET /api/v1/:category?codexId=xxx&worldId=xxx&subCategory=xxx

    const list = catchAsync(
        async (req: Request, res: Response): Promise<void> => {
            const {
                codexId,
                worldId,
                subCategory,
                search,
                isPrivate,
                limit = '50',
                offset = '0',
            } = req.query
            const identityId = req.identity!._id as unknown as Types.ObjectId

            if (!codexId) throw new AppError('codexId is required.', 400)

            const profile = await AetherscribeProfile.findOne({ identityId })
            if (!profile)
                throw new AppError('Aetherscribe account not found.', 404)

            const codex = await Codex.findOne({
                _id: codexId as string,
                accountId: profile._id,
            })
            if (!codex) throw new AppError('Codex not found.', 404)

            const query: Record<string, unknown> = {
                codexId: codexId as string,
                accountId: profile._id,
            }

            if (worldId) query.worldId = worldId as string
            if (subCategory) query.subCategory = subCategory as string
            if (isPrivate !== undefined) query.isPrivate = isPrivate === 'true'

            if (search) {
                query.$text = { $search: search as string }
            }

            const docs = await (ContentModel as any)
                .find(query)
                .sort({ createdAt: -1 })
                .skip(Number(offset))
                .limit(Math.min(Number(limit), 200))

            const total = await (ContentModel as any).countDocuments(query)

            res.status(200).json({
                items: docs.map((d: any) => d.toClient()),
                pagination: {
                    total,
                    limit: Number(limit),
                    offset: Number(offset),
                    hasMore: Number(offset) + docs.length < total,
                },
            })
        }
    )

    // ── Get One ───────────────────────────────────────────────────────────────
    // GET /api/v1/:category/:id

    const getOne = catchAsync(
        async (req: Request<{ id: string }>, res: Response): Promise<void> => {
            const identityId = req.identity!._id as unknown as Types.ObjectId

            const profile = await AetherscribeProfile.findOne({ identityId })
            if (!profile)
                throw new AppError('Aetherscribe account not found.', 404)

            const doc = await (ContentModel as any).findOne({
                _id: req.params.id,
                accountId: profile._id,
            })
            if (!doc) throw new AppError('Document not found.', 404)

            res.status(200).json({ item: doc.toClient() })
        }
    )

    // ── Create ────────────────────────────────────────────────────────────────
    // POST /api/v1/:category

    const create = catchAsync(
        async (req: Request, res: Response): Promise<void> => {
            const identityId = req.identity!._id as unknown as Types.ObjectId

            const profile = await AetherscribeProfile.findOne({ identityId })
            if (!profile)
                throw new AppError('Aetherscribe account not found.', 404)

            const parsed = createSchema.safeParse(req.body)
            if (!parsed.success) {
                const issue = (parsed as any).error.issues[0]
                throw new AppError(issue.message, 400, issue.path[0] as string)
            }

            const data = parsed.data as Record<string, unknown>
            const { codexId } = data

            // Verify codex belongs to user
            const codex = await Codex.findOne({
                _id: codexId as string,
                accountId: profile._id,
            })
            if (!codex) throw new AppError('Codex not found.', 404)

            const slug = slugify(data.name as string)

            const doc = await (ContentModel as any).create({
                ...data,
                accountId: profile._id,
                slug,
                tags: data.tags ?? [],
                isPrivate: data.isPrivate ?? false,
                version: 1,
            })

            // Register doc in the codex content array and recent list
            await Codex.findByIdAndUpdate(codexId, {
                $push: { [`content.${category}`]: doc._id },
            })
            await syncCodexRecent(codexId as string, doc._id, category, doc.name)

            res.status(201).json({ item: doc.toClient() })
        }
    )

    // ── Update ────────────────────────────────────────────────────────────────
    // PATCH /api/v1/:category/:id

    const update = catchAsync(
        async (req: Request<{ id: string }>, res: Response): Promise<void> => {
            const identityId = req.identity!._id as unknown as Types.ObjectId

            const profile = await AetherscribeProfile.findOne({ identityId })
            if (!profile)
                throw new AppError('Aetherscribe account not found.', 404)

            const parsed = updateSchema.safeParse(req.body)
            if (!parsed.success) {
                const issue = (parsed as any).error.issues[0]
                throw new AppError(issue.message, 400, issue.path[0] as string)
            }

            const doc = await (ContentModel as any).findOne({
                _id: req.params.id,
                accountId: profile._id,
            })
            if (!doc) throw new AppError('Document not found.', 404)

            const updates = parsed.data as Record<string, unknown>

            for (const [key, value] of Object.entries(updates)) {
                if (value !== undefined) {
                    doc[key] = value
                }
            }

            // Re-slug if name changed
            if (updates.name) {
                doc.slug = slugify(updates.name as string)
            }

            doc.version = (doc.version ?? 1) + 1
            await doc.save()

            // Refresh this doc at the top of the codex recent list
            await syncCodexRecent(doc.codexId, doc._id, category, doc.name)

            res.status(200).json({ item: doc.toClient() })
        }
    )

    // ── Delete ────────────────────────────────────────────────────────────────
    // DELETE /api/v1/:category/:id

    const remove = catchAsync(
        async (req: Request<{ id: string }>, res: Response): Promise<void> => {
            const identityId = req.identity!._id as unknown as Types.ObjectId

            const profile = await AetherscribeProfile.findOne({ identityId })
            if (!profile)
                throw new AppError('Aetherscribe account not found.', 404)

            const doc = await (ContentModel as any).findOneAndDelete({
                _id: req.params.id,
                accountId: profile._id,
            })
            if (!doc) throw new AppError('Document not found.', 404)

            // Remove from the codex content array and recent list
            await Codex.findByIdAndUpdate(doc.codexId, {
                $pull: {
                    [`content.${category}`]: doc._id,
                    recent: { docId: doc._id },
                },
            })

            res.status(200).json({ message: 'Deleted.' })
        }
    )

    // ── Bulk Delete ───────────────────────────────────────────────────────────
    // DELETE /api/v1/:category/bulk

    const bulkRemove = catchAsync(
        async (req: Request, res: Response): Promise<void> => {
            const identityId = req.identity!._id as unknown as Types.ObjectId

            const profile = await AetherscribeProfile.findOne({ identityId })
            if (!profile)
                throw new AppError('Aetherscribe account not found.', 404)

            const ids: string[] = req.body.ids
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new AppError('ids array is required.', 400)
            }
            if (ids.length > 100) {
                throw new AppError(
                    'Cannot bulk-delete more than 100 items at once.',
                    400
                )
            }

            // Fetch the docs first so we know which codex each belongs to
            const docs = await (ContentModel as any).find(
                { _id: { $in: ids }, accountId: profile._id },
                { _id: 1, codexId: 1 }
            )

            await (ContentModel as any).deleteMany({
                _id: { $in: ids },
                accountId: profile._id,
            })

            // Group deleted IDs by codexId and remove from each codex
            const byCodex = new Map<string, Types.ObjectId[]>()
            for (const doc of docs) {
                const cid = doc.codexId.toString()
                if (!byCodex.has(cid)) byCodex.set(cid, [])
                byCodex.get(cid)!.push(doc._id)
            }

            await Promise.all(
                [...byCodex.entries()].map(([codexId, docIds]) =>
                    Codex.findByIdAndUpdate(codexId, {
                        $pull: {
                            [`content.${category}`]: { $in: docIds },
                            recent: { docId: { $in: docIds } },
                        },
                    })
                )
            )

            res.status(200).json({ deleted: docs.length })
        }
    )

    return { list, getOne, create, update, remove, bulkRemove }
}
