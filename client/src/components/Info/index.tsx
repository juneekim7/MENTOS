import { useParams } from "react-router-dom"
import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { Attendance } from "./Attendance"
import { History } from "./History"
import { useContext, useEffect, useState } from "react"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Mentoring, currentSemester } from "../../../../models/mentoring"
import { MentoringScreen } from "./Mentoring"

export const MentoringInfo: React.FC = () => {
    const { id } = useParams()
    const { userInfo } = useContext(UserInfoContext)
    const [ info, setInfo ] = useState<Mentoring>()

    useEffect(() => {
        (async () => {
            const res = await request("mentoring_info", {
                accessToken: userInfo.accessToken,
                semester: currentSemester(),
                code: parseInt(id ?? "0")
            })

            if (!res.success) return
            setInfo(res.data)
        })()
    }, [id, userInfo])

    if (id === undefined || info === undefined) return <></>

    return (
        <Content>
            <VBox height={32} />
            <MentoringScreen {...info} />
            <VBox height={16} />
            <Attendance />
            <VBox height={48} />
            <History logs={info.logs} />
        </Content>
    )
}