import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { Response, failure, success, type Connection } from '../../models/connection'
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
    cb: (body: Connection[T][0]) => Promise<Response<Connection[T][1]>>
) => {
    app.post(`/api/${event}`, async (req, res) => {
        res.json(await cb(req.body as Connection[T][0]))
    })
}

const subscribers = new Map<number, Set<WebSocket>>()
for (const mentoring of await mentoringColl().find().toArray()) {
    subscribers.set(mentoring.index, new Set())
}

wss.on('connection', (socket, _request) => {
    socket.on('message', (rawData) => {
        const target = Number(rawData.toString('utf-8'))
        const wsSet = subscribers.get(target)
        if (wsSet === undefined) {
            socket.send(JSON.stringify(failure('invalid subscription target')))
            return
        }
        wsSet.add(socket)
        socket.send(JSON.stringify(success(null)))
    })

    socket.on('close', () => {
        for (const [_, wsSet] of subscribers) {
            wsSet.delete(socket)
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
    if (!getUserRes.success) return failure('Invalid user.')

    const mentoringList = await mentoringColl(semester).find().toArray()
    if (mentoringList === null) {
        return failure(`No mentoring in the semester ${semester}`)
    }
    return success(mentoringList)
})

addServerEventListener('mentoring_info', async (body) => {
    const { accessToken, semester, index } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return failure('Invalid user.')

    const mentoring = await mentoringColl(semester).findOne({ index })
    if (mentoring === null) {
        return failure(`No mentoring in the semester ${semester} with the index ${index}`)
    }
    return success(mentoring)
})

addServerEventListener('mentoring_reserve', async (body) => {
    const { accessToken, index, plan } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const mentoring = await mentoringColl().findOne({ index })
    if (mentoring === null) {
        return failure(`No mentoring with the index ${index}`)
    }
    if (!mentoring.mentor.includes(user.id)) {
        return failure('You are not mentor of this mentoring!')
    }

    if (plan.location === '') {
        return failure('Empty location')
    }
    if (plan.start < new Date()) {
        return failure('You cannot reserve past')
    }
    if (plan.start >= plan.end) {
        return failure('You cannot end before start')
    }
    plan.attend = []
    plan.image = ''

    await mentoringColl().updateOne({ index }, {
        working: plan
    })
    return success(null)
})