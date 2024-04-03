export interface ErrorData {
    success: false,
    error: string
}

export interface Success {
    success: true
}

export interface Connection {
    'login': [
        {
            accessToken: string
        },
        Success
    ]
}