import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import { failure, success, type Connection, type Failure } from '../../models/connection'
import { User } from '../../models/user'
import { LogImage, Mentoring, Semester, currentSemester } from '../../models/mentoring'
import { getUser } from './user'

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

export const userColl = (semester: Semester = currentSemester()) => DB.db(semester).collection<User>('user')
export const mentoringColl = (semester: Semester = currentSemester()) => DB.db(semester).collection<Mentoring>('mentoring')
export const logImageColl = (semester: Semester = currentSemester()) => DB.db(semester).collection<LogImage>('logImage')

app.listen(8080, () => {
    console.log('The server has started.')
})

const addServerEventListener = <T extends keyof Connection>(
    event: T,
    cb: (body: Connection[T][0]) => Promise<Connection[T][1] | Failure>
) => {
    app.post(`/api/${event}`, async (req, res) => {
        res.json(await cb(req.body as Connection[T][0]))
    })
}

const subscribers: Record<number, Set<WebSocket>> = {}
for (const mentoring of await mentoringColl().find().toArray()) {
    subscribers[mentoring.index] = new Set()
}

wss.on('connection', (socket, _request) => {
    socket.on('message', (rawData) => {
        const target = Number(rawData.toString('utf-8'))
        if (target in subscribers) {
            subscribers[target].add(socket)
            socket.send(JSON.stringify(success(null)))
        } else {
            socket.send(JSON.stringify(failure('invalid subscription target')))
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
    return await getUser(accessToken)
})

addServerEventListener('mentoring_list', async (body) => {
    const { accessToken, semester } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    const mentoringList = await mentoringColl(semester).find().toArray()
    if (mentoringList === null) {
        return failure(`No mentoring in the semester ${semester}`)
    }
    return success(mentoringList)
})

addServerEventListener('mentoring_info', async (body) => {
    const { accessToken, semester, index } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    const mentoring = await mentoringColl(semester).findOne({ index })
    if (mentoring === null) {
        return failure(`No mentoring in the semester ${semester}`)
    }
    return success(mentoring)
})