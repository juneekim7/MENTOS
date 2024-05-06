import { changhaAccessToken, executeAfterDelay, testReq } from './basic'

async function execute() {
    console.log('execute started')
    await testReq('mentoring_cancel', {
        code: 28
    }, changhaAccessToken)
}

executeAfterDelay(execute)