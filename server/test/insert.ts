import { mentoringColl } from '../src'
import { currentSemester } from '../../models/mentoring'
import { sigma } from './data'

async function insert() {
    console.log('insert started')
    await mentoringColl(currentSemester()).insertMany([
        sigma
    ])
    console.log('insert end')
}

insert()