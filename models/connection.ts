import { Mentoring, Plan, Semester } from './mentoring'
import { User, UserWithIsAdmin } from './user'

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
        UserWithIsAdmin
    ]
    'get_current_semester': [
        {
            accessToken: string
        },
        Semester
    ]
    'mentoring_list': [
        {
            accessToken: string
            semester?: Semester
        },
        Mentoring[]
    ]
    'mentoring_info': [
        {
            accessToken: string
            semester?: Semester
            code: number
        },
        Mentoring
    ]
    'mentoring_reserve': [
        {
            accessToken: string
            code: number
            plan: Plan
        },
        null
    ]
    'mentoring_reserve_cancel': [
        {
            accessToken: string
            code: number
        },
        null
    ]
    'mentoring_start': [
        {
            accessToken: string
            code: number
            location: string
            startImage: string
        },
        null
    ]
    'mentoring_end': [
        {
            accessToken: string
            code: number
            endImage: string
        },
        null
    ]
    'mentoring_cancel': [
        {
            accessToken: string
            code: number
        },
        null
    ]
    'mentoring_attend_req': [
        {
            accessToken: string
            code: number
        },
        null
    ]
    'mentoring_attend_accept': [
        {
            accessToken: string
            code: number
            menteeId: string
        },
        null
    ]
    'mentoring_attend_decline': [
        {
            accessToken: string
            code: number
            menteeId: string
        },
        null
    ]
    'user_list': [
        {
            accessToken: string
        },
        User[]
    ]
    'get_user_name': [
        {
            accessToken: string
            id: string
        },
        string
    ]
    // below here is only for admin
    'verify_admin': [
        {
            accessToken: string
        },
        null
    ]
    'add_users': [
        {
            accessToken: string
            userListString: string
        },
        null
    ]
    'delete_user': [
        {
            accessToken: string
            id: string
        },
        null
    ]
    'add_mentorings': [
        {
            accessToken: string
            mentoringListString: string
            semester: Semester
        },
        null
    ]
    'edit_mentoring': [
        {
            accessToken: string
            semester: Semester
            code: number
            mentoring: Mentoring
        },
        null
    ]
    'delete_mentoring': [
        {
            accessToken: string
            semester: Semester
            code: number
        },
        null
    ]
    'log_image': [
        {
            accessToken: string
            semester: Semester
            imageId: string
        },
        string
    ]
}