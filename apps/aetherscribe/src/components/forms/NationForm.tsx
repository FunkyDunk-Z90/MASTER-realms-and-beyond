'use client'

import BaseForm from './BaseForm'
import { nationsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Nation name' },
    { key: 'subCategory', label: 'Government Type', type: 'select' as const, options: [
        { value: 'kingdom', label: 'Kingdom (Monarchy)' },
        { value: 'empire', label: 'Empire' },
        { value: 'republic', label: 'Republic' },
        { value: 'city_state', label: 'City-State' },
        { value: 'tribal_confederation', label: 'Tribal Confederation' },
        { value: 'theocracy', label: 'Theocracy' },
        { value: 'oligarchy', label: 'Oligarchy' },
        { value: 'duchy', label: 'Duchy' },
        { value: 'federation', label: 'Federation' },
        { value: 'corporate_state', label: 'Corporate / Merchant State' },
    ]},
    { key: 'capitalName', label: 'Capital City', type: 'text' as const, maxLength: 100, placeholder: 'Name of capital' },
    { key: 'population', label: 'Population', type: 'number' as const, min: 0 },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'Overview of the nation…' },
    { key: 'culture', label: 'Culture', type: 'textarea' as const, placeholder: 'Society, values, customs…' },
    { key: 'history', label: 'History', type: 'textarea' as const, placeholder: 'Origin and major historical events…' },
    { key: 'currentEvents', label: 'Current Events', type: 'textarea' as const, placeholder: 'What is happening now?' },
    { key: 'internalConflicts', label: 'Internal Conflicts', type: 'textarea' as const, placeholder: 'Tensions, factions, civil unrest…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function NationForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await nationsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await nationsApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'kingdom',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Nation' : 'New Nation'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
