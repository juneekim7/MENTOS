export type StudentId = `${number}-${number}`

export interface User {
    name: string
    studentId: StudentId
}