

export const getCorrectDate = (date: string) => {
    if (!date || typeof date !== 'string')
        return ""
    let splitSymbol = "."
    let split = date?.split(splitSymbol)
    return split[2] + "-" + split[1] + "-" + split[0]
}