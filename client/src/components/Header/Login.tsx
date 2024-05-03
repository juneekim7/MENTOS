import { useContext } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { css } from "@emotion/react"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { HeaderElement } from "./Element"

export const Login: React.FC = () => {
    const { userInfo, setUserInfo } = useContext(UserInfoContext)

    const googleAuthLogin = useGoogleLogin({
        onSuccess: async (res) => {
            if (setUserInfo === null) return
            const response = await request("login", { accessToken: res.access_token })
            if (!response.success) {
                alert(`Login Failed!\nError message: ${response.error}`)
                return
            }

            const { name, id } = response.data
            setUserInfo({
                ...userInfo,
                name,
                id,
                accessToken: res.access_token,
                isLoggedIn: true
            })
        },
        onError: async (res) => console.log(res)
    })

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID as string}>
            <div css={css`margin: 0 0 0 auto;`}>
                <HeaderElement.Hover onClick={() => userInfo.isLoggedIn || googleAuthLogin()}>
                    {userInfo.isLoggedIn ? userInfo.name : "로그인"}
                </HeaderElement.Hover>
            </div>
        </GoogleOAuthProvider>
    )
}