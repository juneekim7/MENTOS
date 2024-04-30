import axios from 'axios'
import { userColl } from '.'
import { failure, success } from '../../models/connection'
import { StudentId, User } from '../../models/user'

const savedStudentId: Record<string, StudentId> = {}
export async function getUser(accessToken: string) {
    try {
        if (savedStudentId[accessToken] !== undefined) {
            const studentId = savedStudentId[accessToken]
            const foundUser = await userColl().findOne({
                studentId
            })
            if (foundUser !== null) return success(foundUser)
        }

        const { data } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
        )
        if (data.hd !== 'ksa.hs.kr') {
            return failure('You are not KSA student!')
        }
        const studentId = data.email.split('@')[0] as StudentId

        const foundUser = await userColl().findOne({
            studentId
        })

        if (foundUser === null) {
            const newUser: User = {
                name: data.given_name,
                studentId
            }
            await userColl().insertOne(newUser)
            return success(newUser)
        }

        return success(foundUser)
    } catch (error) {
        if (error instanceof Error) return failure(error.message)
        return failure(String(error))
    }
}