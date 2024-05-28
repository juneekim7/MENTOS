import { mentoringColl, withoutId } from '.'
import { failure, success } from '../../models/connection'
import { Auth, Log, maxDuration } from '../../models/mentoring'
import { User } from '../../models/user'
import { getRes } from './utils'

export const getMentoring = getRes(async (code: number, user: User, auth: Auth = 'any') => {
    const mentoring = await mentoringColl().findOne({ code }, withoutId)
    if (mentoring === null) {
        return failure(`코드 ${code}의 멘토링이 존재하지 않습니다.`)
    }
    if (auth === 'mentor' && !mentoring.mentors.map((u) => u.id).includes(user.id)) {
        return failure('당신은 이 멘토링의 멘토가 아닙니다!')
    }
    if (auth === 'mentee' && !mentoring.mentees.map((u) => u.id).includes(user.id)) {
        return failure('당신은 이 멘토링의 멘티가 아닙니다!')
    }
    return success(mentoring)
})

export const checkLog = async (log: Partial<Log>) => {
    const { location, start, end, startImageId, endImageId } = log
    if (location) {
        if (location === '') {
            return failure('장소가 비어있습니다.')
        }
    }
    if (start && end) {
        const duration = end.getTime() - start.getTime()
        if (duration <= 0) {
            return failure('시간은 양수여야 합니다.')
        }
        if (duration >= maxDuration) {
            return failure(`멘토링은 최대 ${maxDuration / (60 * 60 * 1000)} 시간만 가능합니다.`)
        }
    } else if (start || end) {
        return failure('시작 시각과 종료 시각이 모두 존재해야 합니다.')
    }
    if (startImageId) {
        if (startImageId === '') {
            return failure('startImageId가 비어있습니다.')
        }
    }
    if (endImageId) {
        if (endImageId === '') {
            return failure('endImageId가 비어있습니다.')
        }
    }
    return success(null)
}