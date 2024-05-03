export type WSClientRes = {
    query: 'attend_subscribe',
    content: {
        code: number
    }
} 

export type WSServerRes = {
    query: 'abcd',
    content: {
        asdf: string
    }
} 
// | {}
// In union