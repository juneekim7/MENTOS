import axios from 'axios'
import { adminColl, userColl, withoutId } from '.'
import { failure, success } from '../../models/connection'
import { User } from '../../models/user'
import { getRes } from './utils'

interface googleData {
    data: {
        hd: string
        email: string
        given_name: string
    }
}

const savedUser: Record<string, User> = {}

export const getUser = getRes(async (accessToken: string) => {
    if (accessToken === process.env.TEST_JUNEEACCESSTOKEN) {
        return success({
            name: '김준이',
            id: '23-031'
        })
    }
    if (accessToken === process.env.TEST_GAONACCESSTOKEN) {
        return success({
            name: '문가온',
            id: '23-046'
        })
    }
    if (accessToken === process.env.TEST_CHANGHAACCESSTOKEN) {
        return success({
            name: '김창하',
            id: '23-035'
        })
    }
    if (savedUser[accessToken] !== undefined) {
        return success(savedUser[accessToken])
    }

    const { data } = await axios.get<unknown, googleData>(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
    )
    if (data.hd !== 'ksa.hs.kr') {
        return failure('You are not KSA student!')
    }
    const studentId = data.email.split('@')[0]

    const foundUser = await userColl.findOne({
        id: studentId
    }, withoutId)
    const user = foundUser ?? {
        name: data.given_name,
        id: studentId
    }

    if (foundUser === null) {
        await userColl.insertOne(user)
    }

    savedUser[accessToken] = user
    return success(user)
})

export const isAdmin = async (accessToken: string) => {
    const getUserRes = await getUser(accessToken)
    if (!getUserRes.success) return getUserRes
    if (adminColl.findOne({ id: getUserRes.data.id }) === null) {
        return failure('You are not admin.')
    }
    return success(null)
}