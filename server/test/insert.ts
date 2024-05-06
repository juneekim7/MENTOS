import { mentoringColl } from '../src'
import { currentSemester } from '../../models/mentoring'
import { latex, sigma } from './data'

async function insert() {
    console.log('insert started')
    await mentoringColl(currentSemester()).insertMany([
        latex, sigma
    ])
    console.log('insert end')
}

insert()