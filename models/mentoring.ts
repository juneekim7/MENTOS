import { User } from './user'

export type Auth = 'mentor' | 'mentee' | 'any'

export type Semester = `${number}-1` | `${number}-2`

export const maxDuration = 6 * (60 * 60 * 1000)

export interface Plan {
    location: string
    start: Date
    end: Date
}

export interface Log {
    location: string
    start: Date
    end: Date
    attend: User[]
    startImageId: string
    endImageId: string
}

export interface WorkingLog {
    location: string
    start: Date
    attend: User[]
    attendQueue: User[]
    startImageId: string
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
    plan: Plan | null
    logs: Log[]
}