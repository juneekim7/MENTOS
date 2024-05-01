import { Log, Mentoring, Semester } from './mentoring'
import { User } from './user'

export interface Failure {
    success: false
    error: string
}

export interface Success<T> {
    success: true
    data: T
}

export function failure(error: string) {
    return {
        success: false,
        error
    } as Failure
}

export function success<T>(data: T) {
    return {
        success: true,
        data
    } as Success<T>
}

export interface Connection {
    'login': [
        {
            accessToken: string
        },
        Success<User>
    ],
    'mentoring_list': [
        {
            accessToken: string
            semester: Semester
        },
        Success<Mentoring[]>
    ],
    'mentoring_info': [
        {
            accessToken: string
            semester: Semester
            index: number
        },
        Success<Mentoring>
    ],
    'mentoring_reserve': [
        {
            accessToken: string
            index: number
            plan: Log
        },
        Success<null>
    ]
}