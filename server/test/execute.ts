import { executeAfterDelay } from './basic'

async function execute() {
    console.log('execute started')
}

executeAfterDelay(execute)