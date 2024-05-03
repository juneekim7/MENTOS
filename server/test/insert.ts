import { mentoringColl } from '../src'
import { currentSemester } from '../../models/mentoring'
import { valorant } from './data'

async function insert() {
    console.log('insert started')
    await mentoringColl(currentSemester()).insertMany([
        valorant
    ])
    console.log('insert end')
}

insert()