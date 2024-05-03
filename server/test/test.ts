import { currentSemester } from '../../models/mentoring'
import { executeAfterDelay, testReq } from './basic'

async function test() {
    console.log('test started')
    await testReq('login', {})
    await testReq('mentoring_list', { semester: currentSemester() })
    await testReq('mentoring_info', { semester: currentSemester(), code: 25 })
    await testReq('mentoring_reserve', {
        code: 25,
        location: '형설관 3303',
        start: new Date('2024-12-31'),
        duration: 2 * 60 * 60 * 1000
    })
    await testReq('mentoring_start', {
        code: 25,
        location: '형설관 3303',
        startImage: 'exampleimage'
    })
    await testReq('mentoring_end', {
        code: 25,
        endImage: 'exampleimage'
    })
    await testReq('mentoring_rank', {
        semester: currentSemester()
    })
}

executeAfterDelay(test)