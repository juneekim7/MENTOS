export interface IMentoring {
    code: number
    name: string
    mentors: string[]
    class: string
    startTime: string
    accumulatedTime: number
    ranking: number
    isMentee: boolean
    place: string
}

export type IHomeMentoring = Omit<IMentoring, "class" | "accumulatedTime" | "ranking">
export type IMentoringInfo = Omit<IMentoring, "startTime" | "isMentee" | "place">