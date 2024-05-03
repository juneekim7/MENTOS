import fetch from 'node-fetch'
import { Connection, Response } from '../../models/connection'
import { configDotenv } from 'dotenv'

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

configDotenv()
const accessToken = process.env.TEST_ACCESSTOKEN as string
export async function testReq<T extends keyof Connection>(event: T, body: Omit<Connection[T][0], 'accessToken'>) {
    const res = await request(event, { ...body, accessToken })
    console.log(event)
    if (res === undefined) console.log('error: res undefined')
    else if (res.success) console.log('success: ' + JSON.stringify(res.data, null, 4))
    else console.log('error: ' + res.error)
    console.log('----------------------------------------')
}

export function addHours(dateArg: string | number | Date, hours: number) {
    return new Date(new Date(dateArg).getTime() + hours * 60 * 60 * 1000)
}

export function executeAfterDelay(func: () => void) {
    setTimeout(func, 1000)
}