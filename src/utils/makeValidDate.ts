export const makeValidDate = (dateTime: string, normal = false) => {
    if (!dateTime) return ""

    let date = dateTime.toString()
    let split = new Date(date).toLocaleDateString().split(".")
    let time = new Date(date).toLocaleTimeString()

    let datetime = new Date(date)
    //@ts-ignore
    if (datetime === 'Invalid Date' || typeof datetime !== "object")
        split = date.split(".")
    if (time === 'Invalid Date' || typeof time !== "string") {
        time = ""
    }
    if(normal) {
        split = date.split(".")
        time = ""
    }
    let validDate = split[2] + "-" + split[1] + "-" + split[0] + " " + time
    return validDate.trim()
}