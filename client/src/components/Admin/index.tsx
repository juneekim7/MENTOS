import { useContext, useEffect, useState } from "react"
import { Content } from "../common/Content"
import { AdminMentorings } from "./mentorings"
import { AdminUsers } from "./users"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"

type Show = "users" | "mentorings"

export const Admin: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [verifyAdmin, setVerifyAdmin] = useState(false)
    const [show, setShow] = useState<Show>("users")
    useEffect(() => {
        (async () => {
            const res = await request("verify_admin", {
                accessToken: userInfo.accessToken
            })

            if (!res.success) return
            setVerifyAdmin(true)
        })()
    }, [userInfo])
    if (!verifyAdmin) {
        return <>You are not admin!</>
    }
    return (
        <Content>
            <button onClick={() => setShow("users")}>Users</button>
            <button onClick={() => setShow("mentorings")}>Mentorings</button>
            {
                show === "users" ? <AdminUsers /> :
                    show === "mentorings" ? <AdminMentorings defaultSemester='2024-1' /> :
                        "Select Button To See"
            }
        </Content>
    )
}