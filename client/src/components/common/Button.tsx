import { css } from "@emotion/react"
import { CenterBox } from "./CenterBox"
import { TextBox } from "./TextBox"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"

export const Button: React.FC<DivProps> = (props) => {
    return (
        <CenterBox
            css={css`
                width: fit-content;
                margin: 0 auto;
                padding: 8px 24px;
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
                color="white"
            >
                {props.children}
            </TextBox>
        </CenterBox>
    )
}