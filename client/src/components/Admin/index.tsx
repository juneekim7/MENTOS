import { useContext, useEffect, useState } from "react"
import { Content } from "../common/Content"
import { AdminMentorings } from "./mentorings"
import { AdminUsers } from "./users"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Semester } from "../../../../models/mentoring"

type Show = "users" | "mentorings"

export const Admin: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [verifyAdmin, setVerifyAdmin] = useState(false)
    const [defaultSemester, setDefaultSemester] = useState<Semester>("0000-1")
    const [show, setShow] = useState<Show>("users")
    useEffect(() => {
        (async () => {
            const verifyAdminRes = await request("verify_admin", {
                accessToken: userInfo.accessToken
            })

            if (!verifyAdminRes.success) return
            setVerifyAdmin(true)

            const currentSemesterRes = await request("get_current_semester", {
                accessToken: userInfo.accessToken
            })

            if (!currentSemesterRes.success) return
            setDefaultSemester(currentSemesterRes.data)
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
                    show === "mentorings" ? <AdminMentorings defaultSemester={defaultSemester} /> :
                        "Select Button To See"
            }
        </Content>
    )
}