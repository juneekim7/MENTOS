import { Mentoring } from "../../../models/mentoring"
import { ClientUser } from "../types/user"

export const isMentor = (mtr: Mentoring, userInfo: ClientUser) => {
    return mtr.mentors.some((mt) => mt.id === userInfo.id)
}

export const isMentee = (mtr: Mentoring, userInfo: ClientUser) => {
    return mtr.mentees.some((mt) => mt.id === userInfo.id)
}