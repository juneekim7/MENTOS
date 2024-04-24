import { css } from "@emotion/react"
import { omit } from "../../utils/omit"
import { DivProps } from "../../global"

interface FlexBoxProps {
    center?: boolean
    gap?: number
    full?: boolean
}

export const HFlexBox: React.FC<DivProps<FlexBoxProps>> = (props) => {
    return (
        <div
            {...omit(props, "children", "gap", "center", "full")}
            css={css`
                display: flex;
                flex-direction: row;
                align-items: ${props.center ? "center" : "flex-start"};
                gap: ${props.gap ?? 0}px;
                ${props.full && "width: 100%;"}
            `}
        >
            {props.children}
        </div>
    )
}

export const VFlexBox: React.FC<DivProps<FlexBoxProps>> = (props) => {
    return (
        <div
            {...omit(props, "children", "gap", "center", "full")}
            css={css`
                display: flex;
                flex-direction: column;
                align-items: ${props.center ? "center" : "flex-start"};
                gap: ${props.gap ?? 0}px;
                ${props.full && "width: 100%;"}
            `}
        >
            {props.children}
        </div>
    )
}