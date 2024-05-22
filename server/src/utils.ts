import { Response, failure } from '../../models/connection'
import { Semester } from '../../models/mentoring'

export const currentSemester = (): Semester => {
    const now = new Date()
    const oneMonthBefore = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return `${oneMonthBefore.getFullYear()}-${oneMonthBefore.getMonth() <= 7 ? 1 : 2}`
}

export const splitStringIntoChunks = (str: string, linesPerChunk: number) => {
    // 문자열을 줄 단위로 분할
    const lines = str.split('\n')

    // 결과를 저장할 배열
    const chunks = []

    for (let i = 0; i < lines.length; i += linesPerChunk) {
        // 현재 범위의 줄들을 잘라서 하나의 문자열로 합치기
        const chunk = lines.slice(i, i + linesPerChunk).join('\n')
        chunks.push(chunk)
    }

    return chunks
}

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