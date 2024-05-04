import { Response } from './connection'
import { User } from './user'

export interface WSClientReqCont {
    'attend_subscribe': {
        code: number
    }
}

export type WSClientReq<T extends keyof WSClientReqCont> = {
    query: T,
    content: WSClientReqCont[T]
}

export interface WSServerResCont {
    'attend_update': {
        attend: User[],
        attendQueue: User[]
    }
    [C in keyof WSClientReqCont as `${C}_res`]: Response<null>
}

export type WSServerDir<C extends keyof WSClientReqCont> = {
    query: `${C}_res`,
    content: Response<null>
}

export type WSServerRes<S extends keyof WSServerReqCont> = {
    query: S,
    content: WSServerReqCont[S]
}