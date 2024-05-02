import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { Response, failure, success, type Connection } from '../../models/connection'
import { User } from '../../models/user'
import { Log, LogImage, Mentoring, Semester, currentSemester, toRankMentoring } from '../../models/mentoring'
import { getUser } from './user'
import { getRes } from './utils'
import { checkLog, getMentoring } from './mentoring'

export type ParamDict = Record<string, string>

const app = express()
app.use(bodyParser.json())
app.use(cors())

const wss = new WebSocketServer({ port: 3000 })

configDotenv()
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
        res.json(await getRes(cb)(req.body as Connection[T][0]))
    })
}

const subscribers = new Map<number, Set<WebSocket>>()
mentoringColl().find().toArray().then((arr) => {
    for (const mentoring of arr) {
        subscribers.set(mentoring.index, new Set())
    }
})

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
        return failure(`No mentoring in the semester ${semester} with the index ${index}`)
    }
    return success(mentoring)
})

addServerEventListener('mentoring_reserve', async (body) => {
    const { accessToken, index, location, start, duration } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(index, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes

    const checkLogRes = await checkLog({
        location,
        start,
        duration
    })
    if (!checkLogRes.success) return checkLogRes
    if (start < new Date()) {
        return failure('You cannot reserve past')
    }

    const plan: Log = {
        location,
        start,
        duration,
        attend: [],
        startImageId: null,
        endImageId: null
    }

    await mentoringColl().updateOne({ index }, {
        $set: { working: plan }
    })
    return success(null)
})

addServerEventListener('mentoring_start', async (body) => {
    const { accessToken, index, location, startImage } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(index, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes

    const checkLogRes = await checkLog({ location })
    if (!checkLogRes.success) return checkLogRes

    if (startImage === '') {
        return failure('Empty startImage')
    }
    const startImageId = (await logImageColl().insertOne({
        image: startImage
    })).insertedId.toString()

    const working: Log = {
        location,
        start: new Date(),
        duration: 0,
        attend: [],
        startImageId,
        endImageId: null
    }

    await mentoringColl().updateOne({ index }, {
        $set: { working }
    })
    return success(null)
})

addServerEventListener('mentoring_end', async (body) => {
    const { accessToken, index, endImage } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(index, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    const mentoring = getMentoringRes.data

    if (endImage === '') {
        return failure('Empty endImage')
    }
    const endImageId = (await logImageColl().insertOne({
        image: endImage
    })).insertedId.toString()

    const log = mentoring.working
    if (log === null) {
        return failure('Mentoring did not start')
    }
    if (log.startImageId === null) {
        return failure('Empty startImageId')
    }
    log.endImageId = endImageId

    await mentoringColl().updateOne({ index }, {
        $push: { logs: log },
        $set: { working: null }
    })
    return success(null)
})

addServerEventListener('mentoring_rank', getRes(async (body) => {
    const { accessToken, semester } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    return success(
        (await mentoringColl(semester).find().toArray())
            .map((m) => toRankMentoring(m))
    )
}))