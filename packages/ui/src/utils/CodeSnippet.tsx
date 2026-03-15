'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface I_CodeSnippetProps {
    /** The raw code string to display. Leading/trailing whitespace is trimmed. */
    code: string
    /** Language label shown in the header badge (default: 'typescript') */
    lang?: string
    /** Optional filename shown centre of the header */
    filename?: string
    /** Whether to render the copy-to-clipboard button (default: true) */
    showCopy?: boolean
    /** Additional CSS class on the root element */
    className?: string
}

// ─── CodeSnippet ──────────────────────────────────────────────────────────────

export const CodeSnippet = ({
    code,
    lang = 'typescript',
    filename,
    showCopy = true,
    className = '',
}: I_CodeSnippetProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code.trim())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // clipboard access denied — fail silently
        }
    }, [code])

    return (
        <div className={`code-snippet${className ? ` ${className}` : ''}`}>
            <div className="code-snippet__header">
                <span className="code-snippet__lang">{lang}</span>
                {filename && (
                    <span className="code-snippet__filename">{filename}</span>
                )}
                {showCopy && (
                    <button
                        className={`code-snippet__copy${copied ? ' code-snippet__copy--copied' : ''}`}
                        onClick={handleCopy}
                        type="button"
                        aria-label="Copy code to clipboard"
                    >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                )}
            </div>
            <div className="code-snippet__body">
                <pre><code>{code.trim()}</code></pre>
            </div>
        </div>
    )
}
