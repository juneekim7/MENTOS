import { adminColl } from '../src'

async function insert() {
    console.log('insert started')
    await adminColl.insertMany([
        { id: '23-031' },
        { id: '23-031' },
        { id: 'scivol' }
    ])
    console.log('insert end')
}

insert()