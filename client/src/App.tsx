import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { NotiContainer } from "./components/common/Notification"
import { css } from "@emotion/react"
import { Home } from "./components/Home"
import { MentoringInfo } from "./components/Info"
import { Ranking } from "./components/Ranking"
import { UserInfoContext, UserProvider } from "./components/context/User"
import { ModalContainer } from "./components/common/Modal"
import { Profile } from "./components/Profile"
import { Admin } from "./components/Admin"
import { useContext } from "react"
import { TextBox } from "./components/common/TextBox"
import { CenterBox } from "./components/common/CenterBox"

const Content: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)

    if (userInfo.isLoggedIn)
        return <div css={css`padding-top: 60px;`}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/info/:id" element={<MentoringInfo />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/profile/:stdid" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>

    return (
        <CenterBox
            css={css`
                padding-top: 60px;
                height: 100dvh;
            `}
        >
            <TextBox weight={500} size={20}>
                로그인 후 이용해주세요.
            </TextBox>
        </CenterBox>
    )
}

export const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_ID as string}>
            <BrowserRouter>
                <UserProvider>
                    <Header />
                    <NotiContainer />
                    <ModalContainer />
                    <Content />
                </UserProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}