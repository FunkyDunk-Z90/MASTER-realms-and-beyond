'use client'

import BaseForm from './BaseForm'
import { factionsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Faction name' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'guild', label: 'Guild (thieves, merchants, craftsmen)' },
        { value: 'secret_society', label: 'Secret Society' },
        { value: 'military_force', label: 'Military Force / Order' },
        { value: 'religious_order', label: 'Religious Order / Cult' },
        { value: 'criminal', label: 'Criminal Organisation' },
        { value: 'political', label: 'Political Party / Noble House' },
        { value: 'mercantile', label: 'Mercantile / Trading Company' },
        { value: 'scholarly', label: 'Scholarly / Arcane Order' },
        { value: 'tribal', label: 'Tribal / Clan' },
        { value: 'revolutionary', label: 'Revolutionary / Resistance' },
    ]},
    { key: 'influence', label: 'Influence', type: 'select' as const, options: [
        { value: 'negligible', label: 'Negligible' },
        { value: 'minor', label: 'Minor' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'significant', label: 'Significant' },
        { value: 'dominant', label: 'Dominant' },
    ]},
    { key: 'memberCount', label: 'Member Count', type: 'text' as const, maxLength: 100, placeholder: 'e.g. ~200 members, hundreds' },
    { key: 'headquartersName', label: 'Headquarters', type: 'text' as const, maxLength: 150, placeholder: 'Location name' },
    { key: 'isSecret', label: 'Secret Organisation', type: 'checkbox' as const },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'Overview of the faction…' },
    { key: 'goals', label: 'Goals', type: 'textarea' as const, placeholder: 'What do they want?' },
    { key: 'methods', label: 'Methods', type: 'textarea' as const, placeholder: 'How do they operate?' },
    { key: 'publicFace', label: 'Public Face', type: 'textarea' as const, placeholder: 'What the public knows…' },
    { key: 'trueNature', label: 'True Nature', type: 'textarea' as const, placeholder: 'What they really are…' },
    { key: 'secrets', label: 'Secrets', type: 'textarea' as const, placeholder: 'Hidden agendas, dirt…' },
    { key: 'history', label: 'History', type: 'textarea' as const, placeholder: 'Origin and key events…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function FactionForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await factionsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await factionsApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'guild',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Faction' : 'New Faction'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
