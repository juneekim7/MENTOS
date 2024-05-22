import { adminColl } from '../src'
import { executeAfterDelay } from './basic'

async function execute() {
    console.log('execute started')
    await adminColl.findOne({ id: '23-031' })
}

executeAfterDelay(execute)