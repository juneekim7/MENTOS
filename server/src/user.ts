import axios from 'axios'
import { userColl } from '.'
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

    const foundUser = await userColl().findOne({
        studentId
    })
    const user = foundUser ?? {
        name: data.given_name,
        id: studentId
    }

    if (foundUser === null) {
        await userColl().insertOne(user)
    }

    savedUser[accessToken] = user
    return success(user)
})