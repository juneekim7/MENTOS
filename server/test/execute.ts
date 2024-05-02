import { executeAfterDelay, testReq } from './basic'

async function execute() {
    console.log('execute started')
    await testReq('mentoring_reserve', {
        code: 25,
        location: '형3303',
        start: new Date('2024-12-31'),
        duration: 2 * 60 * 60 * 1000
    })
}

executeAfterDelay(execute)