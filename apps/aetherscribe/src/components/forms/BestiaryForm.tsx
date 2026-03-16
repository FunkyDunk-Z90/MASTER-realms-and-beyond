'use client'

import BaseForm from './BaseForm'
import { bestiaryApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Creature name' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'beast', label: 'Beast' },
        { value: 'undead', label: 'Undead' },
        { value: 'construct', label: 'Construct' },
        { value: 'aberration', label: 'Aberration' },
        { value: 'celestial', label: 'Celestial' },
        { value: 'fiend', label: 'Fiend' },
        { value: 'elemental', label: 'Elemental' },
        { value: 'humanoid', label: 'Humanoid' },
        { value: 'dragon', label: 'Dragon' },
        { value: 'fey', label: 'Fey' },
        { value: 'monstrosity', label: 'Monstrosity' },
        { value: 'plant', label: 'Plant' },
        { value: 'ooze', label: 'Ooze' },
        { value: 'giant', label: 'Giant' },
        { value: 'custom', label: 'Custom' },
    ]},
    { key: 'size', label: 'Size', type: 'select' as const, options: [
        { value: 'tiny', label: 'Tiny' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'huge', label: 'Huge' },
        { value: 'gargantuan', label: 'Gargantuan' },
    ]},
    { key: 'challengeRating', label: 'Challenge Rating', type: 'text' as const, placeholder: 'e.g. 5, 1/2, 17' },
    { key: 'armorClass', label: 'Armor Class', type: 'number' as const, min: 0, max: 30 },
    { key: 'hitPoints', label: 'Hit Points', type: 'number' as const, min: 0 },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'Appearance and overview…' },
    { key: 'lore', label: 'Lore', type: 'textarea' as const, placeholder: 'Background, origin, ecology…' },
    { key: 'tactics', label: 'Tactics', type: 'textarea' as const, placeholder: 'How it fights…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'DM notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function BestiaryForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await bestiaryApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await bestiaryApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'beast',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Bestiary Entry' : 'New Bestiary Entry'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
