import fetch from 'node-fetch'
import { Connection, Response } from '../../models/connection'
import { configDotenv } from 'dotenv'
import { WebSocket } from 'ws'
import { WSClientReq, WSClientReqCont } from '../../models/ws'

const SERVER_HOST = 'http://localhost:8080'

const request = async <T extends keyof Connection>(event: T, body: Connection[T][0]): Promise<Response<Connection[T][1]>> => {
    const response = await fetch(`${SERVER_HOST}/api/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    const data = await response.json() as Response<Connection[T][1]>
    return data
}

const divider = '----------------------------------------'

export async function socketRequest<T extends keyof WSClientReqCont>(query: T, content: WSClientReqCont[T]) {
    console.log(query)
    const socket = new WebSocket('ws://localhost:3000')
    socket.onmessage = (event) => {
        console.log(JSON.stringify(event.data))
    }
    socket.onopen = (_event) => {
        socket.send(JSON.stringify({
            query,
            content
        } as WSClientReq<T>))
        console.log(divider)
    }
}

configDotenv()
export const juneeAccessToken = process.env.TEST_JUNEEACCESSTOKEN as string
export const gaonAccessToken = process.env.TEST_GAONACCESSTOKEN as string
export const changhaAccessToken = process.env.TEST_CHANGHAACCESSTOKEN as string

export async function testReq<T extends keyof Connection>(event: T, body: Omit<Connection[T][0], 'accessToken'>, accessToken = juneeAccessToken) {
    const res = await request(event, { ...body, accessToken })
    console.log(event)
    if (res === undefined) console.log('error: res undefined')
    else if (res.success) console.log('success: ' + JSON.stringify(res.data, null, 4))
    else console.log('error: ' + res.error)
    console.log(divider)
}

export function addHours(dateArg: string | number | Date, hours: number) {
    return new Date(new Date(dateArg).getTime() + hours * 60 * 60 * 1000)
}

export function executeAfterDelay(func: () => void) {
    setTimeout(func, 1000)
}