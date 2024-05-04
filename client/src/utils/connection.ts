import { Connection, Response } from "../../../models/connection"
import { WSClientReqCont, WSServerRes } from "../../../models/ws"
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

type WSEventListener<S extends keyof WSServerRes> = (res: WSServerRes[S]["content"]) => void

export class WS {
    ws: WebSocket | null
    eventListeners: {
        [S in keyof WSServerRes]?: WSEventListener<S>[]
    }

    public constructor() {
        this.ws = null
        this.eventListeners = {}
        this.open()
    }

    public request<C extends keyof WSClientReqCont>(query: C, content: WSClientReqCont[C]) {
        if (this.ws === null) throw new Error("The Websocket hasn't opened.")
        this.ws.send(JSON.stringify({
            query,
            content
        }))
    }

    public addEventListener<S extends keyof WSServerRes>(query: S, cb: WSEventListener<S>) {
        this.eventListeners[query] ??= []
        this.eventListeners[query]?.push(cb)
    }

    public open() {
        if (this.ws !== null) throw new Error("The Websocket has already opened.")
        return new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(WEBSOCKET_HOST)
            ws.addEventListener("open", () => {
                ws.addEventListener("message", <S extends keyof WSServerRes>(ev: MessageEvent<string>) => {
                    const res = JSON.parse(ev.data) as WSServerRes[S]
                    const el = this.eventListeners[res.query]
                    el?.forEach((cb) => cb(res.content))
                })
                this.ws = ws
                resolve()
            })
            ws.addEventListener("error", (err) => reject(err))
        })
    }

    public close() {
        console.log(1)
        if (this.ws === null) return
        this.ws.close()
        this.ws = null
    }

    public get isOpen() {
        return this.ws !== null
    }
}

export const ws = new WS()