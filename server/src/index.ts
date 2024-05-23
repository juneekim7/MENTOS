import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { Response, failure, success, type Connection } from '../../models/connection'
import { WSClientReq, WSClientReqCont, WSServerRes, WSServerResCont } from '../../models/ws'
import { User } from '../../models/user'
import { Log, LogImage, Mentoring, WorkingLog } from '../../models/mentoring'
import { getUser, isAdmin } from './user'
import { KeyOfMap, currentSemester, getRes, splitStringIntoChunks } from './utils'
import { checkLog, getMentoring } from './mentoring'

// #region app setting
export type ParamDict = Record<string, string>

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.listen(8080, () => {
    console.log('The server has started.')
    console.log(`current semester: ${currentSemester()}`)
})

const addServerEventListener = <T extends keyof Connection>(
    event: T,
    cb: (body: Connection[T][0]) => Promise<Response<Connection[T][1]>>
) => {
    app.post(`/api/${event}`, async (req, res) => {
        res.json(await getRes(cb)(req.body as Connection[T][0]))
    })
}
// #endregion

// #region db setting
configDotenv()
const DB = new MongoClient(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const userColl = DB.db('user').collection<User>('user')
export const adminColl = DB.db('user').collection<Record<'id', string>>('adminId')
export const mentoringColl = (semester = currentSemester()) => DB.db(semester).collection<Mentoring>('mentoring')
export const logImageColl = (semester = currentSemester()) => DB.db(semester).collection<LogImage>('logImage')
export const withoutId = { projection: { _id: false } }
// #endregion

// #region ws setting
const wss = new WebSocketServer({ port: 3000 })

type WSEventCallback<C extends keyof WSClientReqCont> = (socket: WebSocket, content: WSClientReqCont[C]) => Promise<Response<null>>

type WSEventListener = {
    [C in keyof WSClientReqCont]: WSEventCallback<C>[]
}

const subscribers: Record<keyof WSServerResCont, Map<string, WebSocket[]>> = {
    mentoring_update: new Map<string, WebSocket[]>()
}

mentoringColl().find().toArray().then((arr) => {
    for (const mentoring of arr) {
        subscribers.mentoring_update.set(mentoring.code.toString(), [])
    }
})

const WS: {
    eventListeners: WSEventListener
    send: <S extends keyof WSServerResCont>(key: KeyOfMap<typeof subscribers[S]>, query: S, content: WSServerRes[S]['content']) => void
    addSocketEventListener: <C extends keyof WSClientReqCont>(query: C, cb: WSEventCallback<C>) => void
} = {
    eventListeners: {
        'mentoring_subscribe': []
    },

    send<S extends keyof WSServerResCont>(key: KeyOfMap<typeof subscribers[S]>, query: S, content: WSServerRes[S]['content']) {
        for (const socket of subscribers[query].get(key) ?? []) {
            socket.send(JSON.stringify({
                query,
                content
            } as WSServerRes[S]))
        }
    },

    addSocketEventListener<C extends keyof WSClientReqCont>(query: C, cb: WSEventCallback<C>) {
        const el = this.eventListeners[query]
        if (el === undefined) throw new Error('Invalid query for socket event.')
        el.push(cb)
    }
}

wss.on('connection', (socket, _request) => {
    socket.on('message', <T extends keyof WSClientReqCont>(rawData: RawData) => {
        const { query, content } = JSON.parse(rawData.toString('utf-8')) as WSClientReq<T>
        for (const eventListenerFunc of WS.eventListeners[query] ?? []) {
            eventListenerFunc(socket, content)
        }
    })

    socket.on('close', () => {
        for (const query in subscribers) {
            for (const [_, socketList] of subscribers[query as keyof WSServerResCont]) {
                const index = socketList.indexOf(socket)
                if (index !== -1) socketList.splice(index, 1)
            }
        }
    })
})
// #endregion

WS.addSocketEventListener('mentoring_subscribe', getRes(async (socket, content) => {
    const { code } = content
    subscribers.mentoring_update.get(code.toString())?.push(socket)
    return success(null)
}))

// #region mentoring
addServerEventListener('login', async (body) => {
    const { accessToken } = body
    return await getUser(accessToken)
})

addServerEventListener('get_current_semester', async (body) => {
    const { accessToken } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    return success(currentSemester())
})

addServerEventListener('mentoring_list', async (body) => {
    body.semester ??= currentSemester()
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
    body.semester ??= currentSemester()
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

    WS.send(code.toString(), 'mentoring_update', {
        code
    })
    return success(null)
})

addServerEventListener('mentoring_reserve_cancel', async (body) => {
    const { accessToken, code } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    const mentoring = getMentoringRes.data
    if (mentoring.plan === null) {
        return failure('There is no plan to cancel.')
    }

    await mentoringColl().updateOne({ code }, {
        $set: { plan: null }
    })

    WS.send(code.toString(), 'mentoring_update', {
        code
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

    WS.send(code.toString(), 'mentoring_update', {
        code
    })
    return success(null)
})

addServerEventListener('mentoring_cancel', async (body) => {
    const { accessToken, code } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    if (getMentoringRes.data.working === null) {
        return failure('Mentoring is not in progress.')
    }

    await mentoringColl().updateOne({ code }, {
        $set: { working: null }
    })

    WS.send(code.toString(), 'mentoring_update', {
        code
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

    WS.send(code.toString(), 'mentoring_update', {
        code
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
    attendQueue.push(user)

    await mentoringColl().updateOne({ code }, {
        $push: { 'working.attendQueue': user }
    })


    WS.send(code.toString(), 'mentoring_update', {
        code
    })
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

    WS.send(code.toString(), 'mentoring_update', {
        code
    })
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

    WS.send(code.toString(), 'mentoring_update', {
        code
    })
    return success(null)
})

addServerEventListener('user_list', async (body) => {
    const { accessToken } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    const userList = await userColl.find({}, withoutId).toArray()
    return success(userList)
})
// #endregion

addServerEventListener('is_admin', async (body) => {
    const { accessToken } = body
    const isAdminRes = await isAdmin(accessToken)
    if (!isAdminRes.success) return isAdminRes
    return success(null)
})

addServerEventListener('add_users', async (body) => {
    const { accessToken, userListString } = body
    const isAdminRes = await isAdmin(accessToken)
    if (!isAdminRes.success) return isAdminRes

    const userList: User[] = []
    for (const userString of userListString.split('\n')) {
        const [id, name] = userString.split(' ').map((v) => v.trim())
        userList.push({
            id,
            name
        })
    }

    await userColl.insertMany(userList)
    return success(null)
})

addServerEventListener('add_mentorings', async (body) => {
    const { accessToken, mentoringListString, semester } = body
    const isAdminRes = await isAdmin(accessToken)
    if (!isAdminRes.success) return isAdminRes

    const mentoringList: Mentoring[] = []
    const userList = await userColl.find().toArray()
    for (const mentoringString of splitStringIntoChunks(mentoringListString, 5)) {
        const [codeString, name, mentorsId, menteesId, classification] = mentoringString.split('\n').map((v) => v.trim())
        const code = Number(codeString)
        if (isNaN(code)) return failure('Code is NaN.')

        const mentors = await Promise.all(
            mentorsId.split(' ').map(async (id) => {
                const mentorUser = userList.find((u) => u.id === id)
                if (mentorUser === undefined) {
                    throw new Error(`Invalid mentor id ${id} in ${semester} mentoring ${code} ${name}`)
                }
                return mentorUser
            })
        )
        const mentees = await Promise.all(
            menteesId.split(' ').map(async (id) => {
                const menteeUser = userList.find((u) => u.id === id)
                if (menteeUser === undefined) {
                    throw new Error(`Invalid mentee id ${id} in ${semester} mentoring ${code} ${name}`)
                }
                return menteeUser
            })
        )
        if (!(classification === 'academic' || classification === 'artisan')) return failure('Invalid classification')

        mentoringList.push({
            code,
            name,
            mentors,
            mentees,
            classification,
            working: null,
            plan: null,
            logs: []
        })
    }
    await mentoringColl(semester).insertMany(mentoringList)
    return success(null)
})