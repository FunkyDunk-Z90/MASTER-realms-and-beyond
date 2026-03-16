'use client'

import { useState } from 'react'
import { Button } from '@rnb/ui'

// ─── Shared form field types ──────────────────────────────────────────────────

export type T_FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'number'

export interface I_FormField {
    key: string
    label: string
    type: T_FieldType
    options?: { value: string; label: string }[]
    placeholder?: string
    required?: boolean
    maxLength?: number
    min?: number
    max?: number
}

interface I_BaseFormProps {
    title: string
    fields: I_FormField[]
    onSubmit: (data: Record<string, unknown>) => Promise<void>
    onCancel: () => void
    submitLabel?: string
    initialValues?: Record<string, unknown>
}

// ─── BaseForm ─────────────────────────────────────────────────────────────────

export default function BaseForm({
    title,
    fields,
    onSubmit,
    onCancel,
    submitLabel = 'Create',
    initialValues = {},
}: I_BaseFormProps) {
    const [values, setValues] = useState<Record<string, unknown>>(initialValues)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    function handleChange(key: string, value: unknown) {
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            await onSubmit(values)
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="form-wrapper" onSubmit={handleSubmit}>
            <h2 className="form-title">{title}</h2>

            {fields.map((field) => (
                <div key={field.key} className="field">
                    <label className="field-label" htmlFor={field.key}>
                        {field.label}
                        {field.required && <span aria-hidden="true"> *</span>}
                    </label>

                    {field.type === 'textarea' && (
                        <textarea
                            id={field.key}
                            className="textarea"
                            placeholder={field.placeholder}
                            maxLength={field.maxLength}
                            value={(values[field.key] as string) ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            rows={4}
                        />
                    )}

                    {field.type === 'select' && (
                        <select
                            id={field.key}
                            className="select"
                            value={(values[field.key] as string) ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        >
                            <option value="">Select…</option>
                            {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {field.type === 'checkbox' && (
                        <input
                            id={field.key}
                            type="checkbox"
                            checked={(values[field.key] as boolean) ?? false}
                            onChange={(e) => handleChange(field.key, e.target.checked)}
                        />
                    )}

                    {field.type === 'number' && (
                        <input
                            id={field.key}
                            type="number"
                            className="input"
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            value={(values[field.key] as number) ?? ''}
                            onChange={(e) =>
                                handleChange(
                                    field.key,
                                    e.target.value === '' ? undefined : Number(e.target.value)
                                )
                            }
                        />
                    )}

                    {field.type === 'text' && (
                        <input
                            id={field.key}
                            type="text"
                            className="input"
                            placeholder={field.placeholder}
                            maxLength={field.maxLength}
                            required={field.required}
                            value={(values[field.key] as string) ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        />
                    )}
                </div>
            ))}

            {error && <p className="field-error">{error}</p>}

            <div className="form-actions">
                <Button btnType="submit" isDisabled={submitting} isLoading={submitting}>
                    {submitLabel}
                </Button>
                <Button variant="outline" onClick={onCancel} isDisabled={submitting}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
