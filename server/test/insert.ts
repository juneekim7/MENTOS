import { mentoringColl } from '../src'
import { currentSemester } from '../../models/mentoring'
import { latex } from './data'

async function insert() {
    console.log('insert started')
    await mentoringColl(currentSemester()).insertMany([
        latex
    ])
    console.log('insert end')
}

insert()