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

export function KST(date: string | number | Date = new Date()) {
    return new Date(new Date(date).getTime() + 9 * 60 * 60 * 1000)
}