export const capitalizeFirstLetter = (word: string) => {
    if(!word)
        return ""
    let cut = word.slice(1)
    return word[0].toUpperCase() + cut
}