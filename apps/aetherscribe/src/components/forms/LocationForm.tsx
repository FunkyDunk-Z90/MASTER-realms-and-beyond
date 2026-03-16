'use client'

import BaseForm from './BaseForm'
import { locationsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Location name' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'city', label: 'City' },
        { value: 'town', label: 'Town' },
        { value: 'village', label: 'Village' },
        { value: 'dungeon', label: 'Dungeon / Lair' },
        { value: 'ruin', label: 'Ruin' },
        { value: 'wilderness', label: 'Wilderness / Region' },
        { value: 'building', label: 'Building / Structure' },
        { value: 'landmark', label: 'Landmark' },
        { value: 'plane', label: 'Plane of Existence' },
        { value: 'region', label: 'Region' },
        { value: 'underwater', label: 'Underwater' },
        { value: 'sky', label: 'Sky / Floating' },
    ]},
    { key: 'population', label: 'Population', type: 'number' as const, min: 0, placeholder: 'Approximate population' },
    { key: 'climate', label: 'Climate', type: 'text' as const, maxLength: 100, placeholder: 'e.g. Temperate, Arctic, Desert' },
    { key: 'terrain', label: 'Terrain', type: 'text' as const, maxLength: 100, placeholder: 'e.g. Dense forest, mountainous' },
    { key: 'government', label: 'Government', type: 'text' as const, placeholder: 'e.g. Merchant council, Theocracy' },
    { key: 'ruler', label: 'Ruler', type: 'text' as const, maxLength: 150, placeholder: 'Name and title' },
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'Overview of the location…' },
    { key: 'atmosphere', label: 'Atmosphere', type: 'textarea' as const, placeholder: 'Mood, sights, sounds, smells…' },
    { key: 'history', label: 'History', type: 'textarea' as const, placeholder: 'How did it come to be?' },
    { key: 'dangers', label: 'Dangers', type: 'textarea' as const, placeholder: 'Threats, hazards, enemies…' },
    { key: 'secrets', label: 'Secrets', type: 'textarea' as const, placeholder: 'Hidden information…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'DM notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function LocationForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await locationsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await locationsApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'city',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Location' : 'New Location'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
