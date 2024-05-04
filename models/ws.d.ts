export type WSClientRes = {
    query: 'attend_subscribe',
    content: {
        code: number
    }
}

export type WSServerRes = {
    query: 'attend_update',
    content: {
        attend: User[],
        attendQueue: User[]
    }
}
// | {}
// In union