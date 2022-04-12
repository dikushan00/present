export const getMatchDate = (date: string, time = true, min = false, withMonthName = true) => {
    if (!date)
        return ""
    let currentYear = new Date().getFullYear()
    let dateYear = new Date(date).getFullYear()
    let month: string | number = new Date(date).getMonth() + 1
    let monthName = monthNames[month - 1]
    let day = new Date(date).getDate()

    let minutes: string | number = new Date(date).getMinutes()
    let hours: string | number = new Date(date).getHours()
    if (minutes.toString().length === 1) minutes = "0" + minutes
    if (hours.toString().length === 1) hours = "0" + hours

    let isCurrentYear = currentYear === dateYear
    if (isCurrentYear && withMonthName) {
        if(min)
            monthName = monthName.slice(0, 3) + "."
        if(!time)
            return day + " " + monthName
        return day + " " + monthName + " " + hours + ":" + minutes
    } else {
        if (month.toString().length === 1) month = "0" + month
        if(!withMonthName && isCurrentYear) {
            return day + "." + month + ", " + hours + ":" + minutes
        }
        if(!time)
            return day + "." + month + "." + dateYear
        return day + "." + month + "." + dateYear + ", " + hours + ":" + minutes
    }
}

const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]