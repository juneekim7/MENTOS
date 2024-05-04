import { currentSemester } from '../../models/mentoring'
import { addHours, changhaAccessToken, executeAfterDelay, socketRequest, testReq } from './basic'

async function test() {
    console.log('test started')
    await testReq('login', {})
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
    await testReq('mentoring_start', {
        code: 25,
        location: '형설관 3303',
        startImage: 'exampleimage'
    })

    await socketRequest('attend_subscribe', {
        code: 25
    })
    await testReq('mentoring_attend_req', {
        code: 25
    }, changhaAccessToken)
    await testReq('mentoring_attend_decline', {
        code: 25,
        menteeId: '23-035'
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
    await testReq('mentoring_rank', {
        semester: currentSemester()
    })
}

executeAfterDelay(test)