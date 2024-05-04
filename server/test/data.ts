import { Mentoring } from '../../models/mentoring'
import { User } from '../../models/user'

export const gaon: User = {
    name: '문가온',
    id: '23-046'
}

export const junee: User = {
    name: '김준이',
    id: '23-031'
}

export const changha: User = {
    name: '김창하',
    id: '23-035'
}

export const webDev: Mentoring = {
    code: 25,
    name: '웹개발',
    mentors: [junee, gaon],
    mentees: [changha],
    classification: 'artisan',
    working: null,
    logs: [],
    plan: null
}

export const sigma: Mentoring = {
    code: 10,
    name: '시그마 정멘',
    mentors: [changha, gaon],
    mentees: [{
        name: '총무부',
        id: 'ksacommuni'
    }],
    classification: 'academic',
    working: null,
    logs: [],
    plan: null
}

export const latex: Mentoring = {
    code: 28,
    name: 'LaTeX',
    mentors: [changha],
    mentees: [gaon],
    classification: 'artisan',
    working: null,
    logs: [],
    plan: null
}

export const valorant: Mentoring = {
    code: 35,
    name: '발로란트',
    mentors: [junee],
    mentees: [changha],
    classification: 'artisan',
    working: null,
    logs: [],
    plan: null
}