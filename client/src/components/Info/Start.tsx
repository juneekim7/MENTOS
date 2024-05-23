import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { Mentoring } from "../../../../models/mentoring"
import { HFlexBox } from "../common/FlexBox"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import { EventHandler } from "../../utils/event"
import { RsvModalContent } from "./RsvModalContent"
import { StartModalContent } from "./StartModalContent"

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

interface StartProps {
    info: Mentoring
    forceUpdate: () => void
}

export const Start: React.FC<StartProps> = (props) => {
    return (
        <HFlexBox
            css={css`
                max-width: 500px;
                margin: 0 auto;
            `}
            gap={16}
            center
        >
            <Button onClick={() => EventHandler.trigger("modal", <StartModalContent {...props} />)}>
                시작
            </Button>
            <Button onClick={() => EventHandler.trigger("modal", <RsvModalContent {...props} />)}>
                {props.info.plan === null ? "예약" : "예약 변경"}
            </Button>
        </HFlexBox>
    )
}