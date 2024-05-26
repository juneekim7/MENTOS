export const dateFormat = (d: Date) => {
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()

    return `${year}. ${month}. ${date}.`
}

export const timeFormat = (d: Date) => {
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hour = d.getHours().toString().padStart(2, "0")
    const minute = d.getMinutes().toString().padStart(2, "0")

    return `${year}. ${month}. ${date}. ${hour}:${minute}`
}

export const intervalFormat = (s: Date, e: Date) => {
    const year = s.getFullYear()
    const month = s.getMonth() + 1
    const date = s.getDate()
    const sHour = s.getHours().toString().padStart(2, "0")
    const sMinute = s.getMinutes().toString().padStart(2, "0")
    const eHour = e.getHours().toString().padStart(2, "0")
    const eMinute = e.getMinutes().toString().padStart(2, "0")

    return `${year}. ${month}. ${date}. ${sHour}:${sMinute}~${eHour}:${eMinute}`
}

export const milliToHMS = (milli: number) => {
    if (milli < 0) return "00:00:00"
    const s = Math.floor(milli / 1000)
    const hour = Math.floor(s / 3600)
    const minute = Math.floor((s - 3600 * hour) / 60)
    const second = s - 3600 * hour - 60 * minute

    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
}