
export const sortArrayByDate = (arr: any[] = [], desc: boolean = false, field: string = "date") => {
    return arr.sort((a, b) => {
        let dateStringA = a[field]
        let dateStringB = b[field]
        // if (field === "date") {
        //     let splitA = dateStringA.split(".")
        //     let splitB = dateStringB.split(".")
        //     dateStringA = splitA[1] + "." + splitA[0] + "." + splitA[2]
        //     dateStringB = splitB[1] + "." + splitB[0] + "." + splitB[2]
        // }
        let dateA = new Date(dateStringA).getTime()
        let dateB = new Date(dateStringB).getTime()
        if (dateA < dateB)
            return desc ? 1 : -1
        if (dateA > dateB)
            return desc ? -1 : 1
        return 0
    })
}