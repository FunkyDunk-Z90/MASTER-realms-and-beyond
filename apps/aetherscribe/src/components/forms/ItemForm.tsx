'use client'

import BaseForm from './BaseForm'
import { itemsApi } from '@/src/api/aetherscribeApi'

interface Props {
    codexId: string
    onSuccess: (item: any) => void
    onCancel: () => void
    initialValues?: Record<string, unknown>
    docId?: string
}

const FIELDS = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true, maxLength: 120, placeholder: 'Item name' },
    { key: 'subCategory', label: 'Type', type: 'select' as const, options: [
        { value: 'weapon', label: 'Weapon' },
        { value: 'armor', label: 'Armor' },
        { value: 'tool', label: 'Tool / Equipment' },
        { value: 'consumable', label: 'Consumable (potion, scroll…)' },
        { value: 'artifact', label: 'Artifact (legendary)' },
        { value: 'currency', label: 'Currency / Gem' },
        { value: 'trinket', label: 'Trinket / Jewellery' },
        { value: 'vehicle', label: 'Vehicle / Mount' },
        { value: 'spellbook', label: 'Spellbook / Grimoire' },
        { value: 'wondrous', label: 'Wondrous Item' },
    ]},
    { key: 'rarity', label: 'Rarity', type: 'select' as const, options: [
        { value: 'common', label: 'Common' },
        { value: 'uncommon', label: 'Uncommon' },
        { value: 'rare', label: 'Rare' },
        { value: 'very_rare', label: 'Very Rare' },
        { value: 'legendary', label: 'Legendary' },
        { value: 'artifact', label: 'Artifact' },
        { value: 'unique', label: 'Unique' },
    ]},
    { key: 'description', label: 'Description', type: 'textarea' as const, maxLength: 2000, placeholder: 'What is this item?' },
    { key: 'value', label: 'Value', type: 'text' as const, placeholder: 'e.g. 500 gp, priceless' },
    { key: 'damage', label: 'Damage (weapons)', type: 'text' as const, placeholder: 'e.g. 1d8 + 2' },
    { key: 'armorClass', label: 'Armor Class (armor)', type: 'number' as const, min: 0, max: 30 },
    { key: 'isMagical', label: 'Magical', type: 'checkbox' as const },
    { key: 'requiresAttunement', label: 'Requires Attunement', type: 'checkbox' as const },
    { key: 'history', label: 'History & Lore', type: 'textarea' as const, placeholder: 'Origin, previous owners, legends…' },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional notes…' },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' as const },
]

export default function ItemForm({ codexId, onSuccess, onCancel, initialValues, docId }: Props) {
    async function handleSubmit(data: Record<string, unknown>) {
        if (docId) {
            const { item } = await itemsApi.update(docId, data)
            onSuccess(item)
        } else {
            const { item } = await itemsApi.create({
                ...data,
                codexId,
                subCategory: data.subCategory || 'wondrous',
            })
            onSuccess(item)
        }
    }

    return (
        <BaseForm
            title={docId ? 'Edit Item' : 'New Item'}
            fields={FIELDS}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitLabel={docId ? 'Save Changes' : 'Create'}
            initialValues={initialValues}
        />
    )
}
