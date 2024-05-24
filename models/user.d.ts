export interface User {
    name: string
    id: string
}

export interface UserWithIsAdmin extends User {
    isAdmin: boolean
}