import { useContext, useEffect, useState } from "react"
import { Content } from "../common/Content"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Semester } from "../../../../models/mentoring"
import { AdminDivisonSelector } from "./DivisionSelector"
import { VBox } from "../common/VBox"
import { TextBox } from "../common/TextBox"
import { AdminUsers } from "./Users"
import { AdminMentorings } from "./Mentorings"

export type Show = "users" | "mentorings"

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

    if (!verifyAdmin) return (
        <div>
            You are not admin!
        </div>
    )

    return (
        <Content>
            <VBox height={32} />
            <TextBox size={24} weight={700}>
                관리자 페이지
            </TextBox>
            <VBox height={8} />
            <AdminDivisonSelector division={show} setDivision={setShow} />
            <VBox height={16} />
            {show === "users"
                ? <AdminUsers />
                : show === "mentorings"
                    ? <AdminMentorings defaultSemester={defaultSemester} />
                    : "Select Button to See"}
        </Content>
    )
}