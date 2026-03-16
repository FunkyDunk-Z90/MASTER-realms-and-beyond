'use client'

import BaseForm from './BaseForm'
import { worldsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'World name' },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'A brief overview of your world…' },
    { key: 'primaryRuleset', label: 'Primary Ruleset', type: 'select' as const, options: [
        { value: 'generic', label: 'Generic (system-agnostic)' },
        { value: 'dnd_5e_24', label: 'D&D 5e (2024)' },
        { value: 'aetherscape', label: 'Aetherscape' },
    ]},
    { key: 'visibility', label: 'Visibility', type: 'select' as const, options: [
        { value: 'private', label: 'Private' },
        { value: 'friends_only', label: 'Friends Only' },
        { value: 'public', label: 'Public' },
    ]},
    { key: 'era', label: 'Era / Time Period', type: 'text' as const, maxLength: 150, placeholder: 'e.g. Age of Dragons, Post-Cataclysm' },
    { key: 'magicLevel', label: 'Magic Level', type: 'select' as const, options: [
        { value: 'none', label: 'None' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'wild', label: 'Wild / Unstable' },
    ]},
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes, lore, reminders…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function WorldForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await worldsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await worldsApi.create({
                ...data,
                codexId,
                primaryRuleset: data.primaryRuleset || 'generic',
                visibility: data.visibility || 'private',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit World' : 'New World'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
