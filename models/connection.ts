import { Mentoring, Plan, RankMentoring, Semester } from './mentoring'
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
            code: number
        },
        Mentoring
    ],
    'mentoring_reserve': [
        {
            accessToken: string
            code: number
            plan: Plan
        },
        null
    ],
    'mentoring_start': [
        {
            accessToken: string
            code: number
            location: string
            startImage: string
        },
        null
    ],
    'mentoring_end': [
        {
            accessToken: string
            code: number
            endImage: string
        },
        null
    ],
    'mentoring_attend_req': [
        {
            accessToken: string
            code: number
        },
        null
    ],
    'mentoring_attend_accept': [
        {
            accessToken: string
            code: number
            menteeId: string
        },
        null
    ],
    'mentoring_rank': [
        {
            accessToken: string
            semester: Semester
        },
        RankMentoring[]
    ]
}