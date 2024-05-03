import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { Response, failure, success, type Connection } from '../../models/connection'
import { User } from '../../models/user'
import { Log, LogImage, Mentoring, Semester, SocketRes, WorkingLog, currentSemester, toRankMentoring } from '../../models/mentoring'
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
export const withoutId = { projection: { _id: false } }

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

const subscribers = new Map<number, WebSocket[]>()
mentoringColl().find().toArray().then((arr) => {
    for (const mentoring of arr) {
        subscribers.set(mentoring.code, [])
    }
})

wss.on('connection', (socket, _request) => {
    socket.on('message', (rawData) => {
        const target = Number(rawData.toString('utf-8'))
        const socketList = subscribers.get(target)
        if (socketList === undefined) {
            socket.send(JSON.stringify(failure('invalid subscription target')))
            return
        }
        socketList.push(socket)
        socket.send(JSON.stringify(success(null)))
    })

    socket.on('close', () => {
        for (const [_, socketList] of subscribers) {
            const index = socketList.indexOf(socket)
            if (index !== -1) socketList.splice(index, 1)
            else throw new Error('socket does not exist')
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

    const mentoringList = await mentoringColl(semester).find({}, withoutId).toArray()
    if (mentoringList === null) {
        return failure(`No mentoring in the semester ${semester}`)
    }
    return success(mentoringList)
})

addServerEventListener('mentoring_info', async (body) => {
    const { accessToken, semester, code } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    const mentoring = await mentoringColl(semester).findOne({ code }, withoutId)
    if (mentoring === null) {
        return failure(`No mentoring in the semester ${semester} with the code ${code}`)
    }
    return success(mentoring)
})

addServerEventListener('mentoring_reserve', async (body) => {
    const { accessToken, code, plan } = body
    plan.start = new Date(plan.start)
    plan.end = new Date(plan.end)
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    const mentoring = getMentoringRes.data
    if (mentoring.working !== null) {
        return failure('You cannot reserve if mentoring is working.')
    }

    const checkLogRes = await checkLog(plan)
    if (!checkLogRes.success) return checkLogRes
    if (plan.start < new Date()) {
        return failure('You cannot reserve past')
    }

    await mentoringColl().updateOne({ code }, {
        $set: { plan: plan }
    })
    return success(null)
})

addServerEventListener('mentoring_start', async (body) => {
    const { accessToken, code, location, startImage } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    if (getMentoringRes.data.working !== null) {
        return failure('Mentoring already in progress.')
    }

    const checkLogRes = await checkLog({ location })
    if (!checkLogRes.success) return checkLogRes

    if (startImage === '') {
        return failure('Empty startImage')
    }
    const startImageId = (await logImageColl().insertOne({
        image: startImage
    })).insertedId.toString()

    const working: WorkingLog = {
        location,
        start: new Date(),
        attend: [],
        attendQueue: [],
        startImageId
    }

    await mentoringColl().updateOne({ code }, {
        $set: { working, plan: null }
    })
    return success(null)
})

addServerEventListener('mentoring_end', async (body) => {
    const { accessToken, code, endImage } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    const working = getMentoringRes.data.working
    if (working === null) {
        return failure('Mentoring is not in progress.')
    }
    const { location, start, attend, startImageId } = working

    if (endImage === '') {
        return failure('Empty endImage')
    }
    const endImageId = (await logImageColl().insertOne({
        image: endImage
    })).insertedId.toString()

    const log: Log = {
        location,
        start,
        end: new Date(),
        attend,
        startImageId,
        endImageId
    }
    const checkLogRes = await checkLog(log)
    if (!checkLogRes.success) return checkLogRes

    await mentoringColl().updateOne({ code }, {
        $push: { logs: log },
        $set: { working: null }
    })
    return success(null)
})

addServerEventListener('mentoring_attend_req', async (body) => {
    const { accessToken, code } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentee')
    if (!getMentoringRes.success) return getMentoringRes

    const working = getMentoringRes.data.working
    if (working === null) {
        return failure('Mentoring is not in progress.')
    }
    const attendQueue = working.attendQueue
    if (attendQueue.some((exist) => exist.id === user.id)) {
        return failure(`Mentee ${user.id} is already in attendQueue.`)
    }

    await mentoringColl().updateOne({ code }, {
        $push: { 'working.attendQueue': user }
    })

    for (const socket of subscribers.get(code) ?? []) {
        socket.send(JSON.stringify({
            code,
            attend: working.attend,
            attendQueue
        } as SocketRes))
    }
    return success(null)
})

addServerEventListener('mentoring_attend_accept', async (body) => {
    const { accessToken, code, menteeId } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes

    const working = getMentoringRes.data.working
    if (working === null) {
        return failure('Mentoring is not in progress.')
    }
    const attendQueue = working.attendQueue
    const index = attendQueue.findIndex((exist) => exist.id === menteeId)
    if (index === -1) {
        return failure(`Mentee ${menteeId} is not in attendQueue.`)
    }
    const mentee = attendQueue[index]
    const attend = working.attend
    if (attend.some((exist) => exist.id === menteeId)) {
        return failure(`Mentee ${menteeId} is already in attend.`)
    }

    attendQueue.splice(index, 1)
    attend.push(mentee)
    await mentoringColl().updateOne({ code }, {
        $set: { 'working.attendQueue': attendQueue },
        $push: { 'working.attend': mentee }
    })

    for (const socket of subscribers.get(code) ?? []) {
        socket.send(JSON.stringify({
            code,
            attend,
            attendQueue
        } as SocketRes))
    }
    return success(null)
})

addServerEventListener('mentoring_attend_decline', async (body) => {
    const { accessToken, code, menteeId } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes

    const working = getMentoringRes.data.working
    if (working === null) {
        return failure('Mentoring is not in progress.')
    }
    const attendQueue = working.attendQueue
    const index = attendQueue.findIndex((exist) => exist.id === menteeId)
    if (index === -1) {
        return failure(`Mentee ${menteeId} is not in attendQueue.`)
    }
    const attend = working.attend
    if (attend.some((exist) => exist.id === menteeId)) {
        return failure(`Mentee ${menteeId} is already in attend.`)
    }

    attendQueue.splice(index, 1)
    await mentoringColl().updateOne({ code }, {
        $set: { 'working.attendQueue': attendQueue }
    })

    for (const socket of subscribers.get(code) ?? []) {
        socket.send(JSON.stringify({
            code,
            attend,
            attendQueue
        } as SocketRes))
    }
    return success(null)
})

addServerEventListener('mentoring_rank', getRes(async (body) => {
    const { accessToken, semester } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    return success(
        (await mentoringColl(semester).find({}, withoutId).toArray())
            .map((m) => toRankMentoring(m))
    )
}))