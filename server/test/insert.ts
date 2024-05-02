import { mentoringColl } from '../src'
import { currentSemester } from '../../models/mentoring'
import { webDev } from './data'

async function insert() {
    await mentoringColl(currentSemester()).insertOne(webDev)
}

insert()