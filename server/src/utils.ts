import { Response, failure } from '../../models/connection'

export function getRes<Param extends unknown[], Data>(func: (...args: Param) => Promise<Response<Data>>) {
    return async (...args: Param) => {
        try {
            const res = await func(...args)
            return res
        } catch (error) {
            if (error instanceof Error) return failure(error.message)
            return failure(String(error))
        }
    }
}

export type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never