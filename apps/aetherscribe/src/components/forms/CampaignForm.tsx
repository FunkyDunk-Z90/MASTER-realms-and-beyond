'use client'

import BaseForm from './BaseForm'
import { campaignsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Campaign name' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'main_arc', label: 'Main Arc' },
        { value: 'side_arc', label: 'Side Arc' },
        { value: 'session_log', label: 'Session Log' },
        { value: 'quest', label: 'Quest' },
        { value: 'encounter', label: 'Encounter' },
    ]},
    { key: 'synopsis', label: 'Synopsis', type: 'textarea' as const, maxLength: 3000, placeholder: 'What is this campaign about?' },
    { key: 'tone', label: 'Tone', type: 'text' as const, maxLength: 200, placeholder: 'e.g. Grim survival horror' },
    { key: 'dmNotes', label: 'DM Notes', type: 'textarea' as const, placeholder: 'Private notes for the DM…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'General notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function CampaignForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await campaignsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await campaignsApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'main_arc',
                status: 'planning',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Campaign' : 'New Campaign'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
