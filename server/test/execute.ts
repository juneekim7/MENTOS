import { adminColl } from '../src'
import { executeAfterDelay } from './basic'

async function execute() {
    console.log('execute started')
    await adminColl.insertMany([
        { id: '23-031' },
        { id: '23-031' },
        { id: 'scivol' }
    ])
}

executeAfterDelay(execute)