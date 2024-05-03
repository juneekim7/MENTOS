import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { UserInfoContext } from "../context/User"
import { useContext, useEffect, useState } from "react"
import { WS, request } from "../../utils/connection"
import { Mentoring } from "../../../../models/mentoring"

interface IAttendanceProps {
    info: Mentoring
}

export const Attendance: React.FC<IAttendanceProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [ ws, setWs ] = useState(new WS())

    useEffect(() => {
        // ws.addEventListener()
        return ws.close()
    }, [ws])

    if (props.info.working === null) return (
        <CenterBox
            css={css`
                max-width: 500px;
                margin: 0 auto;
                padding: 12px 0;
                border-radius: 8px;
                background-color: #DADDDF;
            `}
        >
            <TextBox
                size={20}
                color="#909090"
            >
                시작을 기다리는 중...
            </TextBox>
        </CenterBox>
    )

    return (
        <CenterBox
            css={css`
                max-width: 500px;
                margin: 0 auto;
                padding: 12px 0;
                border-radius: 8px;
                background-color: var(--mentos-official);
                transition: all 0.3s linear;
                cursor: pointer;

                :hover {
                    background-color: var(--mentos-official-dark);
                    transform: translateY(-5px);
                }
            `}
            onClick={async () => {
                const res = await request("mentoring_attend_req", {
                    accessToken: userInfo.accessToken,
                    code: props.info.code
                })
                if (!res.success) console.log(res.error)
                else ws.request("attend_subscribe", { code: props.info.code })
            }}
        >
            <TextBox
                weight={700}
                size={28}
                color="white"
            >
                출석
            </TextBox>
        </CenterBox>
    ) 
}