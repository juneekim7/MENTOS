import { executeAfterDelay, testReq } from './basic'

async function execute() {
    console.log('execute started')
    await testReq('mentoring_end', {
        code: 25,
        endImage: 'exampleimage'
    })
}

executeAfterDelay(execute)