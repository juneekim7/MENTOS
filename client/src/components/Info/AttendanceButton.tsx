import { UserInfoContext } from "../context/User"
import { useContext, useState } from "react"
import { WS, request } from "../../utils/connection"
import { Mentoring } from "../../../../models/mentoring"
import { MtrInfoButton } from "./MtrInfoButton"

interface IAttendanceProps {
    info: Mentoring
}

export const AttendanceButton: React.FC<IAttendanceProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [ ws, _setWs ] = useState(new WS())

    if (props.info.working === null)
        return <MtrInfoButton>시작을 기다리는 중...</MtrInfoButton>

    if (props.info.working.attend.some((user) => user.id === userInfo.id))
        return <MtrInfoButton>출석 완료!</MtrInfoButton>

    if (props.info.working.attendQueue.some((user) => user.id === userInfo.id))
        return <MtrInfoButton>출석 체크를 기다리는 중...</MtrInfoButton>

    return (
        <MtrInfoButton
            hover
            onClick={async () => {
                const res = await request("mentoring_attend_req", {
                    accessToken: userInfo.accessToken,
                    code: props.info.code
                })
                if (!res.success) console.log(res.error)
                else ws.request("mentoring_subscribe", { code: props.info.code })
            }}
        >
            출석
        </MtrInfoButton>
    )   
}