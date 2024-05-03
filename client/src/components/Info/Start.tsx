import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { request } from "../../utils/connection"
import { useContext } from "react"
import { UserInfoContext } from "../context/User"
import { Mentoring } from "../../../../models/mentoring"

interface IStart {
    info: Mentoring
    forceUpdate: () => void
}

export const Start: React.FC<IStart> = (props) => {
    const { userInfo } = useContext(UserInfoContext)

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
                const res = await request("mentoring_start", {
                    accessToken: userInfo.accessToken,
                    code: props.info.code,
                    location: "견407",
                    startImage: "Junee Kim"
                })
                if (!res.success) console.log(res.error)
                else props.forceUpdate()
            }}
        >
            <TextBox
                weight={700}
                size={28}
                color="white"
            >
                시작
            </TextBox>
        </CenterBox>
    ) 
}