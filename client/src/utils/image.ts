export const imageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const blob = new Blob([file], { type: "image/png" })
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
            const base64String = reader.result
            resolve(base64String as string)
        }
    })
}