export type Auth = 'mentor' | 'student' | 'any'

export type Semester = `${number}-1` | `${number}-2`
export const currentSemester: () => Semester = () => '2024-1'

export const maxDuration = 6 * (60 * 60 * 1000)

export interface Log {
    location: string
    start: Date
    duration: number
    attend: string[]
    startImageId: string | null
    endImageId: string | null
}

export interface LogImage {
    image: string
}

export interface Mentoring {
    index: number
    name: string
    mentors: string[]
    students: string[]
    classification: 'academic' | 'artisan'
    subject: string

    working: Log | null
    logs: Log[]
}

export interface RankMentoring {
    index: number
    name: string
    time: number
}

export function toRankMentoring(mentoring: Mentoring) {
    const { index, name } = mentoring
    const time = mentoring.logs.reduce((acc, log) => acc + log.duration, 0)
    return {
        index,
        name,
        time
    } as RankMentoring
}