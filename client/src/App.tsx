import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { NotiContainer } from "./components/common/Notification"
import { css } from "@emotion/react"
import { Home } from "./components/Home"
import { MentoringInfo } from "./components/Info"
import { Ranking } from "./components/Ranking"

export const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_ID as string}>
            <BrowserRouter>
                <Header />
                <NotiContainer />
                <div css={css`padding-top: 60px;`}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/info/:id" element={<MentoringInfo />} />
                        <Route path="/ranking" element={<Ranking />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}