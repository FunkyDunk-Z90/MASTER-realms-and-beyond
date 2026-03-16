'use client'

import BaseForm from './BaseForm'
import { charactersApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Character name' },
    { key: 'subCategory', label: 'Status', type: 'select' as const, options: [
        { value: 'hero', label: 'Hero (Active)' },
        { value: 'antihero', label: 'Antihero' },
        { value: 'retired', label: 'Retired' },
        { value: 'deceased', label: 'Deceased' },
    ]},
    { key: 'ancestry', label: 'Ancestry', type: 'text' as const, maxLength: 80, placeholder: 'e.g. Half-Elf, Stonekith' },
    { key: 'characterClass', label: 'Class', type: 'text' as const, maxLength: 80, placeholder: 'e.g. Fighter, Soulweaver' },
    { key: 'level', label: 'Level', type: 'number' as const, min: 1, max: 30, placeholder: '1' },
    { key: 'background', label: 'Background', type: 'text' as const, maxLength: 80, placeholder: 'e.g. Exiled Noble' },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'A brief description…' },
    { key: 'backstory', label: 'Backstory', type: 'textarea' as const, placeholder: 'Character backstory…' },
    { key: 'personalityTraits', label: 'Personality Traits', type: 'textarea' as const, placeholder: 'Personality traits…' },
    { key: 'ideals', label: 'Ideals', type: 'textarea' as const, placeholder: 'Ideals…' },
    { key: 'bonds', label: 'Bonds', type: 'textarea' as const, placeholder: 'Bonds…' },
    { key: 'flaws', label: 'Flaws', type: 'textarea' as const, placeholder: 'Flaws…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function CharacterForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await charactersApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await charactersApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'hero',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Player Character' : 'New Player Character'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
