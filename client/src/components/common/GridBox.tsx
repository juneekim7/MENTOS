import { css } from "@emotion/react"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"

interface GridBoxProps {
    column?: number | string
    row?: number | string
    gap?: number
}

export const GridBox: React.FC<DivProps<GridBoxProps>> = (props) => {
    return (
        <div
            {...omit(props, "children", "column", "row", "gap")}
            css={css`
                display: grid;
                grid-template-columns: repeat(${props.column ?? 1}, 1fr);
                grid-template-rows: repeat(${props.row ?? 1}, 1fr);
                gap: ${props.gap ?? 0}px;
            `}
        >
            {props.children}
        </div>
    )
}