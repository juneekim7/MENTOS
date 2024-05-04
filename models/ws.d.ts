import { Response } from './connection'
import { User } from './user'

export type WSClientReq = {
    query: 'attend_subscribe',
    content: {
        code: number
    }
}

export interface WSServer {
    query: WSClientReq.query,
    content: Response<null>
}

export type WSServerRes = {
    query: 'attend_update',
    content: {
        attend: User[],
        attendQueue: User[]
    }
} | {
    query: `${WSClientReq['query']}_res`,
    content: Response<null>
}
// | {}
// In union