import bodyParser from 'body-parser'
import express, { Request } from 'express'
import cors from 'cors'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import { getUser } from './user'
import type { Connection, ErrorData } from '../../models/connection'

export type ParamDict = Record<string, string>

const app = express()
app.use(bodyParser.json())
app.use(cors())

dotenv.config()
const DB = new MongoClient(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})
export const userColl = DB.db('data').collection<User>('users')
export const problemColl = DB.db('data').collection<Problem>('problems')
export const solutionColl = DB.db('data').collection<Solution>('solutions')

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

addServerEventListener('login', async (body) => {
    const { accessToken } = body
    const user = await getUser(accessToken) // 여기다가 try 넣는 건 좀... getUser에서 try catch해서 error 리턴하게 만드셈

    return { // res.json 대신 return으로. void는 불가능
        success: true,
        user
    }
})

// app.post('/api/google_auth', async (req: Request<ParamDict, LoginRes, LoginReq>, res) => {
//     try {
//         const user = await getUser(req.body.accessToken) as User
//         res.json({
//             success: true,
//             user
//         })
//     } catch (err) {
//         if (!(err instanceof Error)) return
//         res.json({
//             success: false,
//             error: err.message
//         })
//     }
// })

app.post('/api/create_problem', async (req: Request<ParamDict, CreateProblemRes, CreateProblemReq>, res) => {
    try {
        const user = await getUser(req.body.accessToken)
        const problem = req.body.problem
        const solution = req.body.solution
        problem.writer = user._id
        solution.writer = user._id

        const problemId = new ObjectId()
        const solutionId = new ObjectId()
        problem.solutions = [solutionId]
        solution.problem = problemId

        await problemColl.insertOne(problem)
        await solutionColl.insertOne(solution)

        res.json({
            success: true,
            problemId
        })

    } catch (err) {
        if (!(err instanceof Error)) return
        res.json({
            success: false,
            error: err.message
        })
    }
})

// app.post('/api/test', () => {
//     console.log('Success.')
// })