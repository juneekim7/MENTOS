// import { useContext } from "react"
// import { UserContext } from "../../User"
// import { useGoogleLogin } from "@react-oauth/google"
// import { requestLogin } from "../../functions/login"
// import { HeaderElement } from "./Element"
import { css } from "@emotion/react"

export const Login: React.FC = () => {
    // const { user, setUser, isLoggedIn, setIsLoggedIn, setAccessToken } = useContext(UserContext)

    // const googleAuthLogin = useGoogleLogin({
    //     onSuccess: async (res) => {
    //         const data = await requestLogin(res.access_token)
    //         setUser(data.user)
    //         setIsLoggedIn(true)
    //         setAccessToken(res.access_token)
    //     },
    //     onError: async (res) => console.log(res)
    // })

    return (
        <div css={css`margin: 0 0 0 auto;`}>
            로그인
        </div>
    )
}