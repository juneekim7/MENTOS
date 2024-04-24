import { css } from "@emotion/react"
import { omit } from "../../utils/omit"
import { DivProps } from "../../global"

export const CenterBox: React.FC<DivProps> = (props) => {
    return (
        <div
            {...omit(props, "children")}
            css={css`
                display: flex;
                justify-content: center;
                align-items: center;
            `}
        >
            {props.children}
        </div>
    )
}