export const cutWord = (word: string, offset: number = 15) => {
    if (!word || typeof word !== "string")
        return ""

    if (word.length >= offset)
        return word.slice(0, offset) + ".."

    return word
}