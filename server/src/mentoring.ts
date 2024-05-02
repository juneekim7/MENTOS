import { mentoringColl } from '.'
import { failure, success } from '../../models/connection'
import { Auth, Log, maxDuration } from '../../models/mentoring'
import { User } from '../../models/user'
import { getRes } from './utils'

export const getMentoring = getRes(async (index: number, user: User, auth: Auth = 'any') => {
    const mentoring = await mentoringColl().findOne({ index })
    if (mentoring === null) {
        return failure(`No mentoring with the index ${index}`)
    }
    if (auth === 'mentor' && !mentoring.mentor.includes(user.id)) {
        return failure('You are not the mentor of this mentoring!')
    }
    if (auth === 'student' && !mentoring.student.includes(user.id)) {
        return failure('You are not the student of this mentoring!')
    }
    return success(mentoring)
})

export const checkLog = async (log: Partial<Log>) => {
    const { location, duration, startImageId, endImageId } = log
    if (location) {
        if (location === '') {
            return failure('Empty location')
        }
    }
    if (duration) {
        if (duration <= 0) {
            return failure('Duration should be positive')
        }
        if (duration >= maxDuration) {
            return failure(`Duration should be maximum ${maxDuration / (60 * 60 * 1000)} hours`)
        }
    }
    if (startImageId) {
        if (startImageId === '') {
            return failure('Empty startImageId')
        }
    }
    if (endImageId) {
        if (endImageId === '') {
            return failure('Empty endImageId')
        }
    }
    return success(null)
}