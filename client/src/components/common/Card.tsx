import { css } from "@emotion/react"
import { omit } from "../../utils/omit"
import { DivProps } from "../../global"

export const Card: React.FC<DivProps> = (props) => {
    return (
        <div
            {...omit(props, "children")}
            css={css`
                border-radius: 8px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
            `}
        >
            {props.children}
        </div>
    )
}

export const HoverCard: React.FC<DivProps> = (props) => {
    return (
        <div
            {...omit(props, "children")}
            css={css`
                border-radius: 8px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;

                transition: all 0.3s ease 0s;
                cursor: pointer;

                :hover {
                    transform: translateY(-5px);
                }
            `}
        >
            {props.children}
        </div>
    )
}