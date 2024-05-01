
export type Semester = `${number}-1` | `${number}-2`
export const currentSemester: () => Semester = () => '2024-1'

export interface Log {
    location: string
    start: Date
    end: Date
    attend: string[]
    image: string
}

export interface LogImage {
    startImage: string
    endImage: string
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