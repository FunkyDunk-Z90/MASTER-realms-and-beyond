'use client'

import BaseForm from './BaseForm'
import { arcanaApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Arcana entry name' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'spell', label: 'Spell / Cantrip' },
        { value: 'magic_system', label: 'Magic System' },
        { value: 'belief', label: 'Belief / Religion / Deity' },
        { value: 'ritual', label: 'Ritual / Ceremony' },
        { value: 'school', label: 'School / Tradition' },
    ]},
    { key: 'spellLevel', label: 'Spell Level (0–10)', type: 'number' as const, min: 0, max: 10 },
    { key: 'spellSchool', label: 'School of Magic', type: 'select' as const, options: [
        { value: 'abjuration', label: 'Abjuration' },
        { value: 'conjuration', label: 'Conjuration' },
        { value: 'divination', label: 'Divination' },
        { value: 'enchantment', label: 'Enchantment' },
        { value: 'evocation', label: 'Evocation' },
        { value: 'illusion', label: 'Illusion' },
        { value: 'necromancy', label: 'Necromancy' },
        { value: 'transmutation', label: 'Transmutation' },
        { value: 'custom', label: 'Custom' },
    ]},
    { key: 'range', label: 'Range', type: 'text' as const, placeholder: 'e.g. 60 ft, Touch, Self' },
    { key: 'duration', label: 'Duration', type: 'text' as const, placeholder: 'e.g. 1 hour, Concentration up to 1 min' },
    { key: 'damage', label: 'Damage / Effect', type: 'text' as const, placeholder: 'e.g. 8d6 fire' },
    { key: 'deityName', label: 'Deity Name (beliefs)', type: 'text' as const, maxLength: 120, placeholder: 'e.g. Solara, The Pale God' },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'What this arcana entry is…' },
    { key: 'notes', label: 'Full Description / Notes', type: 'textarea' as const, placeholder: 'Full spell text, rules, doctrine…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function ArcanaForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await arcanaApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await arcanaApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'spell',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Arcana Entry' : 'New Arcana Entry'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
