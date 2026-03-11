import { ThemeSwitcher } from '@rnb/ui'

export default function Settings() {
    return (
        <section>
            <h1>Settings</h1>
            <ThemeSwitcher showModePicker={false} showThemeToggle={false} />
        </section>
    )
}
