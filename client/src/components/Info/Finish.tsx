import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { GridBox } from "../common/GridBox"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Mentoring } from "../../../../models/mentoring"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { useContext, useEffect, useRef, useState } from "react"
import { milliToHMS } from "../../utils/time"

interface IFinish {
    info: Mentoring
    forceUpdate: () => void
}

export const Finish: React.FC<IFinish> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const intervalRef = useRef<NodeJS.Timeout>()
    const [ timer, setTimer ] = useState("00:00:00")
    
    useEffect(() => {
        const { working } = props.info
        if (working === null) return

        intervalRef.current = setInterval(() => {
            setTimer(
                milliToHMS(Date.now() - (new Date(working.start)).getTime())
            )
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [props.info])

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
                const res = await request("mentoring_end", {
                    accessToken: userInfo.accessToken,
                    code: props.info.code,
                    endImage: "Gaon"
                })
                if (!res.success) console.log(res.error)
                else props.forceUpdate()
            }}
        >
            <GridBox column={2} css={css`width: 100%;`}>
                <CenterBox css={css`border-right: 1px dashed white;`}>
                    <TextBox
                        weight={700}
                        size={28}
                        color="white"
                    >
                        종료
                    </TextBox>
                </CenterBox>
                <CenterBox>
                    <FontAwesomeIcon
                        icon={faClock}
                        style={{
                            color: "white",
                            marginRight: 8
                        }}
                        size="lg"
                    />
                    <TextBox
                        weight={400}
                        size={20}
                        color="white"
                        inline
                        css={css`font-variant-numeric: tabular-nums;`}
                    >
                        +{timer}
                    </TextBox>
                </CenterBox>
            </GridBox>
        </CenterBox>
    )
}