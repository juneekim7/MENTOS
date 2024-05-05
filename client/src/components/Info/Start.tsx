import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { request } from "../../utils/connection"
import { useContext } from "react"
import { UserInfoContext } from "../context/User"
import { Mentoring } from "../../../../models/mentoring"
import { HFlexBox } from "../common/FlexBox"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import { EventHandler } from "../../utils/event"
import { ModalContent } from "./ModalContent"

const Button: React.FC<DivProps> = (props) => {
    return (
        <CenterBox
            css={css`
                width: 100%;
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
            {...omit(props, "children")}
        >
            <TextBox
                weight={700}
                size={28}
                color="white"
            >
                {props.children}
            </TextBox>
        </CenterBox>
    )
}

interface IStart {
    info: Mentoring
    forceUpdate: () => void
}

export const Start: React.FC<IStart> = (props) => {
    const { userInfo } = useContext(UserInfoContext)

    return (
        <HFlexBox
            css={css`
                max-width: 500px;
                margin: 0 auto;
            `}
            gap={16}
            center
        >
            <Button
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
                시작
            </Button>
            <Button
                onClick={() => EventHandler.trigger("modal", <ModalContent />)}
            >
                예약
            </Button>
        </HFlexBox>
    ) 
}