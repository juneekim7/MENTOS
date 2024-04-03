export interface ErrorData {
    success: false,
    error: string
}

export interface Connection {
    'login': [
        {
            accessToken: string
        },
        {
            success: true
        }
    ]
}