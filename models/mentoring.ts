import { StudentId } from './user'

export type Semester = `${number}-1` | `${number}-2`
export const currentSemester: () => Semester = () => '2024-1'

export interface Log {
    location: string
    start: Date
    end: Date
    attend: StudentId[]
    image: string
}

export interface LogImage {
    startImage: string
    endImage: string
}

export interface Mentoring {
    index: number
    name: string
    mentor: StudentId[]
    student: StudentId[]
    classification: 'academic' | 'artisan'
    subject: string

    working: Log | null
    logs: Log[]
}