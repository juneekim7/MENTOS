import { useContext, useEffect } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { css } from "@emotion/react"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { HeaderElement } from "./Element"
import { useNavigate } from "react-router-dom"
import { HFlexBox } from "../common/FlexBox"

export const Login: React.FC = () => {
    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const navigate = useNavigate()

    const googleAuthLogin = useGoogleLogin({
        onSuccess: async (res) => {
            if (setUserInfo === null) return
            localStorage.setItem("accessToken", res.access_token)
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

    useEffect(() => {
        if (setUserInfo === null) return
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken === null) return
        
        ;(async () => {
            const response = await request("login", { accessToken })
            if (!response.success) {
                alert(`Login Failed!\nError message: ${response.error}`)
                return
            }

            const { name, id, isAdmin } = response.data
            setUserInfo((userInfo) => ({
                ...userInfo,
                name,
                id,
                accessToken,
                isLoggedIn: true,
                isAdmin
            }))
        })()
    }, [setUserInfo])

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID as string}>
            <HFlexBox
                css={css`
                    margin: 0 0 0 auto;
                    gap: 8px;
                `}
            >    
                {userInfo.isLoggedIn &&
                    <HeaderElement.Hover
                        onClick={() => {
                            if (setUserInfo === null) return
                            setUserInfo({
                                name: "",
                                id: "",
                                isLoggedIn: false,
                                accessToken: "",
                                isAdmin: false
                            })
                            localStorage.removeItem("accessToken")
                        }}
                    >
                        로그아웃
                    </HeaderElement.Hover>}
                <HeaderElement.Hover onClick={() => userInfo.isLoggedIn ? navigate(`./profile/${userInfo.id}`) : googleAuthLogin()}>
                    {userInfo.isLoggedIn ? userInfo.name : "로그인"}
                </HeaderElement.Hover>
            </HFlexBox>
        </GoogleOAuthProvider>
    )
}