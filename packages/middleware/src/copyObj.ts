export const copyObj = <T extends Record<string, unknown>>(
    obj: T,
    ...allowedFields: (keyof T)[]
): Partial<T> => {
    const newObj: Partial<T> = {}

    allowedFields.forEach((key) => {
        if (key in obj) {
            newObj[key] = obj[key]
        }
    })

    return newObj
}
