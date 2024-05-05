import { Mentoring } from "../../../models/mentoring"
import { ClientUser } from "../types/user"

export const isMentor = (mtr: Mentoring, userInfo: ClientUser) => {
    return mtr.mentors.some((mt) => mt.id === userInfo.id)
}

export const isMentee = (mtr: Mentoring, userInfo: ClientUser) => {
    return mtr.mentees.some((mt) => mt.id === userInfo.id)
}

export interface RankMentoring {
    code: number
    name: string
    time: number
}

export const toMentoringRank = (mtrList: Mentoring[]) => {
    const rankMtrList = mtrList.map((mtr) => {
        const { code, name } = mtr
        const time = mtr.logs.reduce((acc, log) => acc + new Date(log.end).getTime() - new Date(log.start).getTime(), 0)
        return {
            code,
            name,
            time
        } as RankMentoring
    })
    rankMtrList.sort((a, b) => a.time - b.time)
    return rankMtrList
}