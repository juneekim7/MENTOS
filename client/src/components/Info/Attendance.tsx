import { UserInfoContext } from "../context/User"
import { useContext, useEffect, useState } from "react"
import { WS, request } from "../../utils/connection"
import { Mentoring } from "../../../../models/mentoring"
import { MtrInfoButton } from "./MtrInfoButton"

type Attendance = "ready" | "waiting" | "accepted" 

interface IAttendanceProps {
    info: Mentoring
}

export const Attendance: React.FC<IAttendanceProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [ ws, _setWs ] = useState(new WS())
    const [ attendState, setAttendState ] = useState<Attendance>("ready") 

    useEffect(() => {
        ws.addEventListener("attend_update", (res) => {
            if (res.attend.some((user) => user.id === userInfo.id)) setAttendState("accepted")
            else if (res.attendQueue.some((user) => user.id === userInfo.id)) setAttendState("waiting")
            else setAttendState("ready")
        })

        return ws.close()
    }, [ws, userInfo.id])

    if (props.info.working === null)
        return <MtrInfoButton>시작을 기다리는 중...</MtrInfoButton>

    if (attendState === "ready")
        return (
            <MtrInfoButton
                hover
                onClick={async () => {
                    const res = await request("mentoring_attend_req", {
                        accessToken: userInfo.accessToken,
                        code: props.info.code
                    })
                    if (!res.success) console.log(res.error)
                    else ws.request("attend_subscribe", { code: props.info.code })
                }}
            >
                출석
            </MtrInfoButton>
        ) 
    
    if (attendState === "waiting")
        return <MtrInfoButton>출석 체크를 기다리는 중...</MtrInfoButton>

    return <MtrInfoButton>출석 완료!</MtrInfoButton>
}