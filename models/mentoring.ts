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
    mentor: string[]
    student: string[]
    classification: 'academic' | 'artisan'
    subject: string

    working: Log | null
    logs: Log[]
}