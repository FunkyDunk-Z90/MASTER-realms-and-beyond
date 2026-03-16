'use client'

// ─── Base ─────────────────────────────────────────────────────────────────────

const BASE =
    process.env.NEXT_PUBLIC_AETHERSCRIBE_API_URL ?? 'http://localhost:8811'

// ─── Error messages ───────────────────────────────────────────────────────────

function httpErrorMessage(status: number, serverMessage?: string): string {
    // 4xx with a clear server message — surface it directly (validation, conflicts, etc.)
    if (status >= 400 && status < 500 && serverMessage) return serverMessage

    switch (status) {
        case 400:
            return 'The scroll was malformed. Check your entries and try again.'
        case 401:
            return 'Your arcane seal has expired. Please log in again.'
        case 403:
            return 'You lack the authority to perform this rite.'
        case 404:
            return 'That entry could not be found in the archives.'
        case 409:
            return 'A conflict arose in the records. This may already exist.'
        case 429:
            return 'Too many requests. The oracle needs a moment to recover.'
        case 500:
            return 'The arcane servers have trembled. Our scribes are on it — try again shortly.'
        case 502:
        case 503:
        case 504:
            return 'The realm is unreachable right now. Please try again in a moment.'
        default:
            if (status >= 500)
                return 'Something stirred in the dark. An unexpected error occurred on our end.'
            return `An unknown error occurred (${status}).`
    }
}

// ─── Request ──────────────────────────────────────────────────────────────────

async function request<T>(
    method: string,
    path: string,
    body?: unknown
): Promise<T> {
    let res: Response

    try {
        res = await fetch(`${BASE}${path}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
    } catch {
        // fetch() itself threw — network unreachable, DNS failure, CORS preflight blocked, etc.
        throw new Error(
            'The ravens could not reach the server. Check your connection and try again.'
        )
    }

    // Try to parse JSON — some error responses may not be valid JSON
    let data: any
    try {
        data = await res.json()
    } catch {
        data = null
    }

    if (!res.ok) {
        throw new Error(httpErrorMessage(res.status, data?.message))
    }

    return data as T
}

// ─── Codex ────────────────────────────────────────────────────────────────────

export const codexApi = {
    list: () => request<{ codices: any[] }>('GET', '/api/v1/codex'),
    get: (id: string) => request<{ codex: any }>('GET', `/api/v1/codex/${id}`),
    create: (body: {
        name: string
        description?: string
        coverImageUrl?: string
    }) => request<{ codex: any }>('POST', '/api/v1/codex', body),
    update: (
        id: string,
        body: { name?: string; description?: string; coverImageUrl?: string }
    ) => request<{ codex: any }>('PATCH', `/api/v1/codex/${id}`, body),
    delete: (id: string) =>
        request<{ message: string }>('DELETE', `/api/v1/codex/${id}`),
    setDefault: (id: string) =>
        request<{ codex: any }>('PATCH', `/api/v1/codex/${id}/set-default`),
}

// ─── Generic Content ──────────────────────────────────────────────────────────

function contentApi(endpoint: string) {
    return {
        list: (params: {
            codexId: string
            worldId?: string
            subCategory?: string
            search?: string
            limit?: number
            offset?: number
        }) => {
            const qs = new URLSearchParams()
            for (const [k, v] of Object.entries(params)) {
                if (v !== undefined) qs.set(k, String(v))
            }
            return request<{ items: any[]; pagination: any }>(
                'GET',
                `/api/v1/${endpoint}?${qs.toString()}`
            )
        },
        get: (id: string) =>
            request<{ item: any }>('GET', `/api/v1/${endpoint}/${id}`),
        create: (body: Record<string, unknown>) =>
            request<{ item: any }>('POST', `/api/v1/${endpoint}`, body),
        update: (id: string, body: Record<string, unknown>) =>
            request<{ item: any }>('PATCH', `/api/v1/${endpoint}/${id}`, body),
        delete: (id: string) =>
            request<{ message: string }>('DELETE', `/api/v1/${endpoint}/${id}`),
        bulkDelete: (ids: string[]) =>
            request<{ deleted: number }>('DELETE', `/api/v1/${endpoint}/bulk`, {
                ids,
            }),
    }
}

export const worldsApi = contentApi('worlds')
export const campaignsApi = contentApi('campaigns')
export const charactersApi = contentApi('characters')
export const npcsApi = contentApi('npcs')
export const bestiaryApi = contentApi('bestiary')
export const ancestriesApi = contentApi('ancestries')
export const loreApi = contentApi('lore')
export const itemsApi = contentApi('items')
export const arcanaApi = contentApi('arcana')
export const locationsApi = contentApi('locations')
export const nationsApi = contentApi('nations')
export const factionsApi = contentApi('factions')
