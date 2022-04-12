export const copyTextToClipboard = (text: string | number) => {
    navigator.clipboard.writeText(text.toString())
}