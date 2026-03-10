'use client'

/**
 * ThemeInitializer
 *
 * Renders an inline script in <head> that reads saved theme/mode from
 * localStorage and applies them to <html> before React hydrates.
 * Prevents the flash of un-themed content (FOUC).
 *
 * Storage keys and default theme must match what is passed to ThemeProvider.
 */

export interface I_ThemeInitializerProps {
    /** Must match the ThemeProvider `themeStorageKey`. @default 'rnb-theme' */
    themeStorageKey?: string
    /** Must match the ThemeProvider `modeStorageKey`. @default 'rnb-mode' */
    modeStorageKey?: string
    /** Fallback theme if no value is saved. @default 'arcade' */
    defaultTheme?: string
}

export const ThemeInitializer: React.FC<I_ThemeInitializerProps> = ({
    themeStorageKey = 'rnb-theme',
    modeStorageKey = 'rnb-mode',
    defaultTheme = 'global-theme',
}) => {
    const script = `
        (function() {
            try {
                var theme = localStorage.getItem(${JSON.stringify(themeStorageKey)}) || ${JSON.stringify(defaultTheme)};
                var mode  = localStorage.getItem(${JSON.stringify(modeStorageKey)})  || 'system';
                var html  = document.documentElement;
                html.setAttribute('data-theme', theme);
                if (mode !== 'system') {
                    html.setAttribute('data-mode', mode);
                } else {
                    html.removeAttribute('data-mode');
                }
            } catch (e) {
                console.warn('ThemeInitializer: unable to read theme from localStorage', e);
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
