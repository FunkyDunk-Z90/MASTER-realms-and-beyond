import { I_DropdownOption } from '@rnb/ui'

export const basicOptions: I_DropdownOption[] = [
    { id: 'dash', label: 'Dashboard', value: 'dashboard' },
    { id: 'profile', label: 'Profile', value: 'profile' },
    { id: 'settings', label: 'Settings', value: 'settings' },
    { id: 'admin', label: 'Admin Panel', value: 'admin', disabled: true },
]

export const nestedOptions: I_DropdownOption[] = [
    {
        id: 'reports',
        label: 'Reports',
        children: [
            { id: 'monthly', label: 'Monthly', value: 'monthly' },
            { id: 'annual', label: 'Annual', value: 'annual' },
        ],
    },
    { id: 'export', label: 'Export CSV', value: 'export' },
    { id: 'archive', label: 'Archive', value: 'archive' },
]

export const searchableOptions: I_DropdownOption[] = [
    { id: 's1', label: 'TypeScript', value: 'ts' },
    { id: 's2', label: 'JavaScript', value: 'js' },
    { id: 's3', label: 'Rust', value: 'rust' },
    { id: 's4', label: 'Go', value: 'go' },
    { id: 's5', label: 'Python', value: 'python' },
    { id: 's6', label: 'Elixir', value: 'elixir' },
]
