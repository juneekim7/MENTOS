import { css } from "@emotion/react"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"

export const VBox: React.FC<DivProps<{ height: number, bg?: string }>> = (props) => {
    return (
        <div
            {...omit(props, "children", "height", "bg")}
            css={css`
                width: 100%;
                height: ${props.height}px;
                background-color: ${props.bg ?? "transparent"};
            `}
        />
    )
}