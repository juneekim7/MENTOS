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
    logs: []
}

export const sigma: Mentoring = {
    code: 10,
    name: '시그마 정멘',
    mentors: [changha, gaon],
    mentees: [],
    classification: 'academic',
    working: null,
    logs: []
}