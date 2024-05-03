import { User } from './user'

export type Auth = 'mentor' | 'mentee' | 'any'

export type Semester = `${number}-1` | `${number}-2`
export const currentSemester: () => Semester = () => '2024-1'

export const maxDuration = 6 * (60 * 60 * 1000)

export interface Log {
    location: string
    start: Date
    duration: number
    attend: User[]
    startImageId: string | null
    endImageId: string | null
}

export interface WorkingLog extends Log {
    attendQueue: User[]
}

export interface SocketRes {
    code: number
    attend: User[]
    attendQueue: User[]
}

export interface LogImage {
    image: string
}

export interface Mentoring {
    code: number
    name: string
    mentors: User[]
    mentees: User[]
    classification: 'academic' | 'artisan'

    working: WorkingLog | null
    logs: Log[]
}

export interface RankMentoring {
    code: number
    name: string
    time: number
}

export function toRankMentoring(mentoring: Mentoring) {
    const { code, name } = mentoring
    const time = mentoring.logs.reduce((acc, log) => acc + log.duration, 0)
    return {
        code,
        name,
        time
    } as RankMentoring
}