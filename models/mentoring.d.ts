import { StudentId } from './user'

export interface History {
    location: string
    start: Date
    end: Date
    attend: Set<StudentId>
}

export interface HistoryImage {
    startImage: string
    endImage: string
}

export interface Mentoring {
    name: string
    mentor: Set<StudentId>
    student: Set<StudentId>
    classification: 'academic' | 'artisan'
    subject: string

    schedule: {
        location: string
        start: Date
    } | null

    logs: History[]
}