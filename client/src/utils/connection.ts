import { Connection, Response } from "../../../models/connection"
import { SERVER_HOST } from "../server.config"

export const request = async <T extends keyof Connection>(event: T, body: Connection[T][0]): Promise<Response<Connection[T][1]>> => {
    const response = await fetch(`${SERVER_HOST}/api/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    const data = await response.json() as Response<Connection[T][1]>
    if (!data.success) throw new Error(data.error)
    
    console.log(data)
    return data
}