import { Response } from './connection'
import { User } from './user'

export interface WSClientReqCont {
    'attend_subscribe': {
        code: number
    }
}

export interface WSClientReq<T extends keyof WSClientReqCont> {
    query: T
    content: WSClientReqCont[T]
}

type WSServerDirCont = {
    [C in keyof WSClientReqCont as `${C}_res`]: Response<null>
}

interface WSServerResCont {
    'attend_update': {
        code: number
        attend: User[]
        attendQueue: User[]
    }
}

export type WSServerRes = {
    [S in keyof WSServerDirCont | keyof WSServerResCont]: {
        query: S
        content: S extends keyof WSServerDirCont ? WSServerDirCont[S] : WSServerResCont[S]
    }
}