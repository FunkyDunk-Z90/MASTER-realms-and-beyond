'use client'

import BaseForm from './BaseForm'
import { ancestriesApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'e.g. Stonekith, Verdani' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'ancestry', label: 'Ancestry (core)' },
        { value: 'heritage', label: 'Heritage (sub-ancestry)' },
    ]},
    { key: 'size', label: 'Size', type: 'select' as const, options: [
        { value: 'tiny', label: 'Tiny' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
    ]},
    { key: 'speed', label: 'Base Speed (ft)', type: 'number' as const, min: 0, max: 120 },
    { key: 'lifespan', label: 'Lifespan', type: 'text' as const, maxLength: 100, placeholder: 'e.g. 200–400 years' },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'Overview of the ancestry…' },
    { key: 'appearance', label: 'Appearance', type: 'textarea' as const, placeholder: 'Physical description…' },
    { key: 'culture', label: 'Culture', type: 'textarea' as const, placeholder: 'Society, customs, traditions…' },
    { key: 'history', label: 'History', type: 'textarea' as const, placeholder: 'Origin and history…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function AncestryForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await ancestriesApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await ancestriesApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'ancestry',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Ancestry / Heritage' : 'New Ancestry / Heritage'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
