'use client'

import BaseForm from './BaseForm'
import { loreApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Title', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Lore entry title' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'history', label: 'History' },
        { value: 'myth', label: 'Myth / Origin Story' },
        { value: 'culture', label: 'Culture' },
        { value: 'religion_overview', label: 'Religion Overview' },
        { value: 'event', label: 'Notable Event' },
        { value: 'prophecy', label: 'Prophecy / Omen' },
        { value: 'legend', label: 'Legend / Folklore' },
    ]},
    { key: 'era', label: 'Era', type: 'text' as const, maxLength: 150, placeholder: 'e.g. The Third Age, Before the Sundering' },
    { key: 'inWorldDate', label: 'In-World Date', type: 'text' as const, maxLength: 150, placeholder: 'e.g. Year 423, Month of Frost' },
    { key: 'significance', label: 'Significance', type: 'select' as const, options: [
        { value: 'minor', label: 'Minor' },
        { value: 'notable', label: 'Notable' },
        { value: 'major', label: 'Major' },
        { value: 'world_changing', label: 'World-Changing' },
    ]},
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'Summary of this lore entry…' },
    { key: 'notes', label: 'Full Account / Notes', type: 'textarea' as const, placeholder: 'The full lore text, sources, context…' },
    { key: 'isSecret', label: 'Secret (hidden from players)', type: 'checkbox' as const },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function LoreForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await loreApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await loreApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'history',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Lore Entry' : 'New Lore Entry'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
