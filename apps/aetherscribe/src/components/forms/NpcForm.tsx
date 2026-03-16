'use client'

import BaseForm from './BaseForm'
import { npcsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'NPC name' },
    { key: 'subCategory', label: 'Role', type: 'select' as const, options: [
        { value: 'general', label: 'General' },
        { value: 'villain', label: 'Villain' },
        { value: 'ally', label: 'Ally / Mentor' },
        { value: 'merchant', label: 'Merchant / Vendor' },
        { value: 'quest_giver', label: 'Quest Giver' },
        { value: 'neutral', label: 'Neutral' },
    ]},
    { key: 'occupation', label: 'Occupation', type: 'text' as const, maxLength: 100, placeholder: 'e.g. Blacksmith, Spymaster' },
    { key: 'affiliation', label: 'Affiliation', type: 'text' as const, maxLength: 200, placeholder: 'Organisation, faction, etc.' },
    { key: 'disposition', label: 'Disposition', type: 'select' as const, options: [
        { value: 'friendly', label: 'Friendly' },
        { value: 'neutral', label: 'Neutral' },
        { value: 'hostile', label: 'Hostile' },
        { value: 'unknown', label: 'Unknown' },
        { value: 'varies', label: 'Varies' },
    ]},
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'A brief description…' },
    { key: 'personality', label: 'Personality', type: 'textarea' as const, placeholder: 'How do they speak and act?' },
    { key: 'goals', label: 'Goals', type: 'textarea' as const, placeholder: 'What do they want?' },
    { key: 'secrets', label: 'Secrets', type: 'textarea' as const, placeholder: 'What are they hiding?' },
    { key: 'backstory', label: 'Backstory', type: 'textarea' as const, placeholder: 'Their history…' },
    { key: 'roleplaying', label: 'Roleplaying Tips', type: 'textarea' as const, placeholder: 'Voice, mannerisms, hooks…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function NpcForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await npcsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await npcsApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'general',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit NPC' : 'New NPC'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
