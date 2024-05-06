import { Mentoring } from "../../../models/mentoring"
import { User } from "../../../models/user"

export interface RankUser extends User {
    part: number
}

export const toUserRanking = (mtrList: Mentoring[]) => {
    const userList: User[] = []
    const usedId = new Set<string>()
    const partOfUser: Map<string, number> = new Map<string, number>()

    for (const mtr of mtrList) {
        for (const log of mtr.logs) {
            for (const user of log.attend) {
                const { id, name } = user
                if (!usedId.has(id)) {
                    usedId.add(id)
                    userList.push({
                        name,
                        id
                    })
                }
                partOfUser.set(user.id, (partOfUser.get(user.id) ?? 0) + 1)
            }
        }
    }

    const rankUserList = userList.map((user) => {
        const { id, name } = user
        return {
            id,
            name,
            part: partOfUser.get(id)
        } as RankUser
    })
    rankUserList.sort((a, b) => b.part - a.part)
    return rankUserList
}