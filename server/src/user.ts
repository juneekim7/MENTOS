import axios from 'axios'
import { User } from '../../models/user'
import { userColl } from '.'
import { WithId } from 'mongodb'

const savedEmail: Record<string, string> = {}

export const isValidUser = async (accessToken: string) => {
    if (savedEmail[accessToken] !== undefined) {
        return true
    }
    try {
        const { data } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
        )
        const email: string = data.email
        savedEmail[accessToken] = email
        return true
    } catch (err) {
        return false
    }
}

export const getEmail = async (accessToken: string) => {
    if (! await isValidUser(accessToken)) {
        throw new Error('Invalid accessToken')
    }
    return savedEmail[accessToken]
}

export const getUser = async (accessToken: string): Promise<User> => {
    if (! await isValidUser(accessToken)) {
        throw new Error('Invalid accessToken')
    }
    const email = savedEmail[accessToken]

    const foundUser = await userColl.findOne({
        email
    })

    if (foundUser === null) {
        const newUser: User = {
            id: email.split('@')[0],
            email,
            role: 'user'
        }
        const res = await userColl.insertOne(newUser)

        return {
            _id: res.insertedId,
            ...newUser
        } as WithId<User>
    }

    return foundUser
}