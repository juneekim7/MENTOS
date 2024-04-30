import fetch from 'node-fetch'
import { Connection, Failure } from '../../models/connection'
import { Mentoring, currentSemester } from '../../models/mentoring'
import { mentoringColl } from '.'

const SERVER_HOST = 'http://localhost:8080'
const request = async <T extends keyof Connection>(event: T, body: Connection[T][0]): Promise<Connection[T][1]> => {
    const response = await fetch(`${SERVER_HOST}/api/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    const data = await response.json() as Connection[T][1] | Failure
    if (!data.success) throw new Error(data.error)

    return data
}
const accessToken = process.env.TEST_ACCESSTOKEN as string

const webDevClass: Mentoring = {
    index: 12,
    name: '웹개발',
    mentor: ['23-031', '23-046'],
    student: ['23-016'],
    classification: 'artisan',
    subject: '',

    schedule: {
        location: '형설관 3511',
        start: new Date()
    },

    now: null,
    logs: []
}
await mentoringColl(currentSemester()).insertOne(webDevClass)

console.log(await request('login', { accessToken }))
console.log(await request('mentoring_list', { accessToken, semester: currentSemester() }))