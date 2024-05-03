import { User } from "../../../models/user"

interface IMentoring {
    code: number
    name: string
    mentors: User[]
    class: string
    plan: string
    accumulatedTime: number
    ranking: number
    isMentee: boolean
    isMentor: boolean
    hasStarted: boolean
    place: string
}

export type IHomeMentoring = Omit<IMentoring, "class" | "accumulatedTime" | "ranking">
export type IMentoringInfo = Omit<IMentoring, "startTime" | "isMentee" | "place">