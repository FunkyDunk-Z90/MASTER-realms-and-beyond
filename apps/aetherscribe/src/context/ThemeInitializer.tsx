'use client'

/**
 * ThemeInitializer
 *
 * This component should be rendered in the <head> of your layout to prevent
 * theme flashing. It uses a dangerouslySetInnerHTML script that runs BEFORE
 * React hydration to apply saved theme preferences to the HTML element.
 *
 * Place this in your layout.tsx like:
 * ```tsx
 * <ThemeInitializer />
 * ```
 */

export const ThemeInitializer: React.FC = () => {
    const script = `
        (function() {
            try {
                const theme = localStorage.getItem('aether-theme') || 'teal';
                const mode = localStorage.getItem('aether-mode') || 'system';
                const html = document.documentElement;
                
                // CRITICAL FIX: Always set data-theme attribute, even for teal
                // This ensures CSS selectors like html[data-theme='teal'] match immediately
                // This is essential for teal + light mode to work
                html.setAttribute('data-theme', theme);
                
                // Apply mode attribute
                if (mode !== 'system') {
                    html.setAttribute('data-mode', mode);
                } else {
                    html.removeAttribute('data-mode');
                }
            } catch (e) {
                // localStorage might not be available in some contexts
                console.warn('ThemeInitializer: Unable to read theme from localStorage', e);
            }
        })();
    `

    return (
        <script
            dangerouslySetInnerHTML={{ __html: script }}
            suppressHydrationWarning
        />
    )
}
