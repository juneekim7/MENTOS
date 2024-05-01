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

export type Response<T> = Success<T> | Failure

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
        User
    ],
    'mentoring_list': [
        {
            accessToken: string
            semester: Semester
        },
        Mentoring[]
    ],
    'mentoring_info': [
        {
            accessToken: string
            semester: Semester
            index: number
        },
        Mentoring
    ],
    'mentoring_reserve': [
        {
            accessToken: string
            index: number
            plan: Log
        },
        Response<null>
    ]
}