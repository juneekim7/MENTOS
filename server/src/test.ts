import fetch from 'node-fetch'
import { Connection, Response } from '../../models/connection'
import { currentSemester } from '../../models/mentoring'
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

async function testReq<T extends keyof Connection>(event: T, body: Connection[T][0]) {
    const res = await request(event, body)
    console.log(event)
    if (res === undefined) console.log('error: res undefined')
    else if (res.success) console.log('success: ' + JSON.stringify(res.data, null, 4))
    else console.log('error: ' + res.error)
    console.log('----------------------------------------')
}

async function test() {
    console.log('test started')
    await testReq('login', { accessToken })
    await testReq('mentoring_list', { accessToken, semester: currentSemester() })
    await testReq('mentoring_info', { accessToken, semester: currentSemester(), index: 25 })
    await testReq('mentoring_reserve', {
        accessToken, index: 25,
        location: '형3303',
        start: new Date('2024-12-31'),
        duration: 2 * 60 * 60 * 1000
    })
    await testReq('mentoring_start', {
        accessToken, index: 25,
        location: '형3303',
        startImage: 'exampleimage'
    })
    await testReq('mentoring_end', {
        accessToken, index: 25,
        endImage: 'exampleimage'
    })
}

setTimeout(test, 1 * 1000)