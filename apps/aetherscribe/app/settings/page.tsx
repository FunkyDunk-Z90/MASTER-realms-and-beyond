import { ThemeSwitcher } from '@/src/context/ThemeSwitcher'

export default function Settings() {
    return (
        <section>
            <h1>Settings</h1>
            <section>
                <h2>Theme</h2>
                <p>Choose your preferred theme and display mode.</p>

                {/* This shows both theme picker and mode picker */}
                <ThemeSwitcher showThemePicker showModePicker />

                {/* Or use separately: */}
                {/* <ThemeSwitcher showThemePicker={false} /> - mode only */}
                {/* <ThemeSwitcher showModePicker={false} /> - theme only */}
            </section>
        </section>
    )
}
