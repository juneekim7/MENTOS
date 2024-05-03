import { mentoringColl } from '../src'
import { currentSemester } from '../../models/mentoring'
import { sigma, webDev } from './data'

async function insert() {
    console.log('insert started')
    await mentoringColl(currentSemester()).insertMany([
        webDev, sigma
    ])
    console.log('insert end')
}

insert()