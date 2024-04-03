import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import { getUser } from './user'
import type { Connection, ErrorData, Success } from '../../models/connection'
import { User } from '../../models/user'
import { HistoryImage, Mentoring } from '../../models/mentoring'

export type ParamDict = Record<string, string>

const app = express()
app.use(bodyParser.json())
app.use(cors())

const wss = new WebSocketServer({ port: 3000 })

dotenv.config()
const DB = new MongoClient(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

type Semester = `${number}-1` | `${number}-2`
const currentSemester = '2024-1'

export const userColl = (semester: Semester) => DB.db(semester).collection<User>('user')
export const mentoringColl = (semester: Semester) => DB.db(semester).collection<Mentoring>('mentoring')
export const historyImageColl = (semester: Semester) => DB.db(semester).collection<HistoryImage>('historyImage')

app.listen(8080, () => {
    console.log('The server has started.')
})

const addServerEventListener = <T extends keyof Connection>(
    event: T,
    cb: (body: Connection[T][0]) => Promise<Connection[T][1] | ErrorData>
) => {
    app.post(`/api/${event}`, async (req, res) => {
        res.json(await cb(req.body as Connection[T][0]))
    })
}

const subscribers: Record<string, Set<WebSocket>> = {}

for (const mentoring of await mentoringColl(currentSemester).find().toArray()) {
    subscribers[mentoring.index] = new Set()
}

wss.on('connection', (socket, _request) => {
    socket.on('message', (rawData) => {
        const target = rawData.toString('utf-8')
        if (target in subscribers) {
            subscribers[target].add(socket)
            socket.send(JSON.stringify({
                success: true
            } as Success))
        } else {
            socket.send(JSON.stringify({
                success: false,
                error: 'invalid subscription target'
            } as ErrorData))
        }
    })

    socket.on('close', () => {
        for (const target in subscribers) {
            subscribers[target].delete(socket)
        }
    })
})

addServerEventListener('login', async (body) => {
    const { accessToken } = body
    const user = await getUser(accessToken) // 여기다가 try 넣는 건 좀... getUser에서 try catch해서 error 리턴하게 만드셈

    return { // res.json 대신 return으로. void는 불가능
        success: true,
        user
    }
})