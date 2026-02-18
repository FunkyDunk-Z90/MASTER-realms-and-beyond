export const formatDate = (date?: Date): string | undefined => {
    if (!date) return undefined

    return (
        date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }) +
        ', ' +
        date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
    )
}
