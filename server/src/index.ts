import express from 'express'
import { configDotenv } from 'dotenv'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { Response, failure, success, type Connection } from '../../models/connection'
import { WSClientReq, WSClientReqCont, WSServerRes, WSServerResCont } from '../../models/ws'
import { User } from '../../models/user'
import { Log, LogImage, Mentoring, WorkingLog, maxDuration } from '../../models/mentoring'
import { getUser, verifyAdmin } from './user'
import { KeyOfMap, currentSemester, getRes, splitStringIntoChunks } from './utils'
import { checkLog, getMentoring } from './mentoring'
import ViteExpress from 'vite-express'
// import { readFileSync } from 'fs'
// import { createServer as httpsCreateServer } from 'https'
// import { createServer as viteCreateServer } from 'vite'

// #region app setting
export type ParamDict = Record<string, string>

// const privateKey = readFileSync('/etc/letsencrypt/live/ksamentos.kr/privkey.pem', 'utf8')
// const certificate = readFileSync('/etc/letsencrypt/live/ksamentos.kr/cert.pem', 'utf8')
// const ca = readFileSync('/etc/letsencrypt/live/ksamentos.kr/chain.pem', 'utf8')
// const _credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca
// }

const app = express()
app.use(express.json({
    limit: '10mb'
}))
// const httpsServer = httpsCreateServer(credentials, app)
ViteExpress.config({
    mode: 'production',
    inlineViteConfig: {
        build: {
            outDir: '../client/dist'
        }
    }
})

ViteExpress.listen(app, 80, () => {
    console.log('The server has started!')
})
// const vite = await viteCreateServer({
//     server: {
//         middlewareMode: true,
//         hmr: {
//             server: httpsServer
//         }
//     }
// })

// app.use()

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
        const socketList = subscribers[query].get(key) ?? []
        const deleteSockets: WebSocket[] = []
        for (const socket of socketList) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    query,
                    content
                } as WSServerRes[S]))
            } else {
                deleteSockets.push(socket)
            }
        }
        if (deleteSockets.length > 0) {
            subscribers[query].set(key, socketList?.filter((socket) => !deleteSockets.includes(socket)))
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
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    return success({
        ...getUserRes.data,
        isAdmin: await adminColl.findOne({ id: getUserRes.data.id }) !== null
    })
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
        return failure(`${semester}학기에 멘토링이 존재하지 않습니다.`)
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
        return failure(`${semester} 학기에 코드 ${code}를 가진 멘토링이 없습니다.`)
    }
    return success(mentoring)
})

const cancelMentoringReservation = async (code: number) => {
    await mentoringColl().updateOne({ code }, {
        $set: { plan: null }
    })

    WS.send(code.toString(), 'mentoring_update', {
        code
    })
}

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
        return failure('멘토링이 진행중일 때 멘토링 예약을 할 수 없습니다.')
    }

    const checkLogRes = await checkLog(plan)
    if (!checkLogRes.success) return checkLogRes
    if (plan.start < new Date()) {
        return failure('과거에 예약할 수 없습니다.')
    }

    await mentoringColl().updateOne({ code }, {
        $set: { plan: plan }
    })
    setTimeout(async () => {
        const updatedMentoring = await mentoringColl().findOne({ code })
        if (updatedMentoring === null) return
        const updatedPlan = updatedMentoring.plan
        if (updatedPlan === null) return
        if (JSON.stringify(updatedPlan) === JSON.stringify(plan)) {
            cancelMentoringReservation(code)
        }
    }, plan.end.getTime() - new Date().getTime() + 1000)

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
        return failure('취소할 예약이 없습니다.')
    }

    cancelMentoringReservation(code)
    return success(null)
})

const cancelMentoring = async (code: number) => {
    await mentoringColl().updateOne({ code }, {
        $set: { working: null }
    })

    WS.send(code.toString(), 'mentoring_update', {
        code
    })
}

addServerEventListener('mentoring_start', async (body) => {
    const { accessToken, code, location, startImage } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    const user = getUserRes.data

    const getMentoringRes = await getMentoring(code, user, 'mentor')
    if (!getMentoringRes.success) return getMentoringRes
    if (getMentoringRes.data.working !== null) {
        return failure('멘토링이 이미 진행중입니다.')
    }

    const checkLogRes = await checkLog({ location })
    if (!checkLogRes.success) return checkLogRes

    if (startImage === '') {
        return failure('시작 이미지가 없습니다.')
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
    setTimeout(async () => {
        const updatedMentoring = await mentoringColl().findOne({ code })
        if (updatedMentoring === null) return
        const updatedWorking = updatedMentoring.working
        if (updatedWorking === null) return
        if (JSON.stringify(updatedWorking) === JSON.stringify(working)) {
            cancelMentoring(code)
        }
    }, maxDuration + 1000)

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
        return failure('멘토링이 진행중이 아닙니다.')
    }

    cancelMentoring(code)
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
        return failure('멘토링이 진행중이 아닙니다.')
    }
    const { location, start, attend, startImageId } = working
    const end = new Date()
    if (end.getTime() - start.getTime() > maxDuration) {
        end.setTime(start.getTime() + maxDuration)
    }
    if (attend.length === 0) {
        cancelMentoring(code)
        return failure('출석한 멘티가 없습니다.')
    }

    if (endImage === '') {
        return failure('종료 사진이 없습니다.')
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
        return failure('멘토링이 진행중이 아닙니다.')
    }
    const attendQueue = working.attendQueue
    if (attendQueue.some((exist) => exist.id === user.id)) {
        return failure(`멘티 ${user.id}는 이미 출석 요청 목록에 있습니다.`)
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
        return failure('멘토링이 진행중이 아닙니다.')
    }
    const attendQueue = working.attendQueue
    const index = attendQueue.findIndex((exist) => exist.id === menteeId)
    if (index === -1) {
        return failure(`멘티 ${menteeId}는 출석 요청 목록에 없습니다.`)
    }
    const mentee = attendQueue[index]
    const attend = working.attend
    if (attend.some((exist) => exist.id === menteeId)) {
        return failure(`멘티 ${menteeId}는 이미 출석했습니다.`)
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
        return failure('멘토링이 진행중이 아닙니다.')
    }
    const attendQueue = working.attendQueue
    const index = attendQueue.findIndex((exist) => exist.id === menteeId)
    if (index === -1) {
        return failure(`멘티 ${menteeId}는 출석 요청 목록에 없습니다.`)
    }
    const attend = working.attend
    if (attend.some((exist) => exist.id === menteeId)) {
        return failure(`멘티 ${menteeId}는 이미 출석 요청 목록에 있습니다.`)
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

addServerEventListener('get_user_name', async (body) => {
    const { accessToken, id } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    const targetUser = await userColl.findOne({ id }, withoutId)
    if (targetUser === null) {
        return failure(`아이디가 ${id}인 유저가 존재하지 않습니다.`)
    }
    return success(targetUser.name)
})

addServerEventListener('get_user_name', async (body) => {
    const { accessToken, id } = body
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes

    const targetUser = await userColl.findOne({ id }, withoutId)
    if (targetUser === null) {
        return failure(`아이디가 ${id}인 유저가 존재하지 않습니다.`)
    }
    return success(targetUser.name)
})
// #endregion

// #region admin
addServerEventListener('verify_admin', async (body) => {
    const { accessToken } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes
    return success(null)
})

addServerEventListener('add_users', async (body) => {
    const { accessToken, userListString } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes

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

addServerEventListener('delete_user', async (body) => {
    const { accessToken, id } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes

    await userColl.findOneAndDelete({ id })
    return success(null)
})

addServerEventListener('add_mentorings', async (body) => {
    const { accessToken, mentoringListString, semester } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes

    const mentoringList: Mentoring[] = []
    const userList = await userColl.find().toArray()
    for (const mentoringString of splitStringIntoChunks(mentoringListString, 5)) {
        const [codeString, name, mentorsId, menteesId, classification] = mentoringString.split('\n').map((v) => v.trim())
        const code = Number(codeString)
        if (isNaN(code)) return failure('코드가 수가 아닙니다.')

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
        if (!(classification === 'academic' || classification === 'artisan')) return failure('잘못된 분류입니다.')

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

addServerEventListener('edit_mentoring', async (body) => {
    const { accessToken, semester, code, mentoring } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes

    await mentoringColl(semester).findOneAndReplace({ code }, mentoring)
    return success(null)
})

addServerEventListener('delete_mentoring', async (body) => {
    const { accessToken, semester, code } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes

    await mentoringColl(semester).findOneAndDelete({ code })
    return success(null)
})

addServerEventListener('log_image', async (body) => {
    body.semester ??= currentSemester()
    const { accessToken, semester, startImageId, endImageId } = body
    const verifyAdminRes = await verifyAdmin(accessToken)
    if (!verifyAdminRes.success) return verifyAdminRes

    const startLogImage = await logImageColl(semester).findOne({ _id: new ObjectId(startImageId) })
    if (startLogImage === null) {
        return failure(`시작 이미지 ${startImageId}가 존재하지 않습니다.`)
    }
    const endLogImage = await logImageColl(semester).findOne({ _id: new ObjectId(endImageId) })
    if (endLogImage === null) {
        return failure(`종료 이미지 ${endImageId}가 존재하지 않습니다.`)
    }
    return success({
        startImage: startLogImage.image,
        endImage: endLogImage.image
    })
})
// #endregion