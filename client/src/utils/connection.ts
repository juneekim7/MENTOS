import { Connection, Response } from "../../../models/connection"
import { WSClientRes, WSServerRes } from "../../../models/ws"
import { SERVER_HOST, WEBSOCKET_HOST } from "../server.config"

export const request = async <T extends keyof Connection>(event: T, body: Connection[T][0]): Promise<Response<Connection[T][1]>> => {
    const response = await fetch(`${SERVER_HOST}/api/${event}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    const data = await response.json() as Response<Connection[T][1]>
    if (!data.success) throw new Error(data.error)
    
    console.log(event, body, data)
    return data
}

type WSEventListener<S extends WSServerRes> = (res: S["content"]) => void

export class WS<C extends WSClientRes, S extends WSServerRes> {
    ws: WebSocket
    eventListeners: Map<S["query"], WSEventListener<S>[]>

    public constructor() {
        this.ws = new WebSocket(WEBSOCKET_HOST)
        this.ws.addEventListener("message", (ev) => {
            const res = JSON.parse(ev.data) as WSServerRes
            const el = this.eventListeners.get(res.query)
            if (el === undefined) return
            el.forEach((cb) => cb(res.content))
        })
        this.eventListeners = new Map()
    }

    public request(query: C["query"], content: C["content"]) {
        this.ws.send(JSON.stringify({
            query,
            content
        }))
    }

    public addEventListener(query: S["query"], cb: WSEventListener<S>) {
        const el = this.eventListeners.get(query)
        if (el === undefined) return
        el.push(cb)
    }

    public close() {
        this.ws.close()
    }
}