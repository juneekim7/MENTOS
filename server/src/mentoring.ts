import { mentoringColl, withoutId } from '.'
import { failure, success } from '../../models/connection'
import { Auth, Log, Semester, maxDuration } from '../../models/mentoring'
import { User } from '../../models/user'
import { getRes } from './utils'

export const currentSemester: () => Semester = () => {
    const now = new Date()
    const oneMonthBefore = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return `${oneMonthBefore.getFullYear()}-${oneMonthBefore.getMonth() <= 7 ? 1 : 2}`
}

export const getMentoring = getRes(async (code: number, user: User, auth: Auth = 'any') => {
    const mentoring = await mentoringColl().findOne({ code }, withoutId)
    if (mentoring === null) {
        return failure(`No mentoring with the code ${code}`)
    }
    if (auth === 'mentor' && !mentoring.mentors.map((u) => u.id).includes(user.id)) {
        return failure('You are not the mentor of this mentoring!')
    }
    if (auth === 'mentee' && !mentoring.mentees.map((u) => u.id).includes(user.id)) {
        return failure('You are not the mentee of this mentoring!')
    }
    return success(mentoring)
})

export const checkLog = async (log: Partial<Log>) => {
    const { location, start, end, startImageId, endImageId } = log
    if (location) {
        if (location === '') {
            return failure('Empty location')
        }
    }
    if (start && end) {
        const duration = end.getTime() - start.getTime()
        if (duration <= 0) {
            return failure('Duration should be positive')
        }
        if (duration >= maxDuration) {
            return failure(`Duration should be maximum ${maxDuration / (60 * 60 * 1000)} hours`)
        }
    } else if (start || end) {
        return failure('There must be start and end')
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