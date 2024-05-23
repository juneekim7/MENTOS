// import { readFileSync } from 'fs'
import { addHours, changhaAccessToken, executeAfterDelay, socketRequest, testReq } from './basic'
// import { resolve } from 'path'
import { currentSemester } from '../src/utils'

async function _test() {
    console.log('test started')
    await testReq('login', {})
    await socketRequest('mentoring_subscribe', {
        code: 25
    })
    await testReq('mentoring_list', { semester: currentSemester() })
    await testReq('mentoring_info', { semester: currentSemester(), code: 25 })
    await testReq('mentoring_reserve', {
        code: 25,
        plan: {
            location: '형설관 3303',
            start: new Date('2024-12-31'),
            end: addHours('2024-12-31', 2)
        }
    })
    await testReq('mentoring_reserve_cancel', {
        code: 25
    })
    await testReq('mentoring_start', {
        code: 25,
        location: '형설관 3303',
        startImage: 'exampleimage'
    })
    await testReq('mentoring_attend_req', {
        code: 25
    }, changhaAccessToken)
    await testReq('mentoring_attend_decline', {
        code: 25,
        menteeId: '23-035'
    })
    await testReq('mentoring_cancel', {
        code: 25
    })
    await testReq('mentoring_start', {
        code: 25,
        location: '형설관 3303',
        startImage: 'exampleimage'
    })
    await testReq('mentoring_attend_req', {
        code: 25
    }, changhaAccessToken)
    await testReq('mentoring_attend_accept', {
        code: 25,
        menteeId: '23-035'
    })

    await testReq('mentoring_end', {
        code: 25,
        endImage: 'exampleimage'
    })

    await testReq('user_list', {
        semester: currentSemester()
    })
}

async function adminTest() {
    console.log('admin test started')

    await testReq('add_mentorings', {
        semester: '2024-1',
        mentoringListString: '35\n발로란트\n23-031\n23-046\nartisan'
    })
}

executeAfterDelay(adminTest)