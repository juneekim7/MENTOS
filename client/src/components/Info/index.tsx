import { useParams } from "react-router-dom"
import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { AttendanceButton } from "./AttendanceButton"
import { History } from "./History"
import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { request, ws } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Mentoring } from "../../../../models/mentoring"
import { MentoringScreen } from "./Mentoring"
import { Start } from "./Start"
import { Finish } from "./Finish"
import { Attendance } from "./Attendance"

export const MentoringInfo: React.FC = () => {
    const { id } = useParams()
    const { userInfo } = useContext(UserInfoContext)
    const [ info, setInfo ] = useState<Mentoring>()
    const [ r, rerender ] = useState({})
    const forceUpdate = useCallback(() => rerender({}), [])

    useEffect(() => {
        (async () => {
            const res = await request("mentoring_info", {
                accessToken: userInfo.accessToken,
                code: parseInt(id ?? "0")
            })

            if (!res.success) return
            setInfo(res.data)
        })()
    }, [id, userInfo, r])

    useEffect(() => {
        const code = parseInt(id ?? "0")
        ;(async () => {
            await ws.open()
            ws.addEventListener("mentoring_update", (res) => {
                if (code === res.code) forceUpdate()
            })
            ws.request("mentoring_subscribe", { code })
        })()
        return () => ws.close()
    }, [forceUpdate, id])

    if (id === undefined || info === undefined) return <></>

    return (
        <Content>
            <VBox height={32} />
            <MentoringScreen {...info} />
            <VBox height={16} />
            {info.mentors.some((mtr) => mtr.id === userInfo.id)
                ? (info.working !== null
                    ? <Finish forceUpdate={forceUpdate} info={info} />
                    : <Start forceUpdate={forceUpdate} info={info} />)
                : <AttendanceButton info={info} />}
            <VBox height={48} />
            {info.mentors.some((mtr) => mtr.id === userInfo.id) && info.working !== null &&
                <Fragment>
                    <Attendance queue={info.working.attendQueue} code={info.code} forceUpdate={forceUpdate} />
                    <VBox height={48} />
                </Fragment>}
            <History logs={info.logs} mentors={info.mentors} />
            <VBox height={32} />
        </Content>
    )
}