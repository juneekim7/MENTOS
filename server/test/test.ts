import { currentSemester } from '../../models/mentoring'
import { executeAfterDelay, testReq } from './functions'

async function test() {
    console.log('test started')
    await testReq('login', {})
    await testReq('mentoring_list', { semester: currentSemester() })
    await testReq('mentoring_info', { semester: currentSemester(), index: 25 })
    await testReq('mentoring_reserve', {
        index: 25,
        location: '형3303',
        start: new Date('2024-12-31'),
        duration: 2 * 60 * 60 * 1000
    })
    await testReq('mentoring_start', {
        index: 25,
        location: '형3303',
        startImage: 'exampleimage'
    })
    await testReq('mentoring_end', {
        index: 25,
        endImage: 'exampleimage'
    })
}

executeAfterDelay(test)