import { css } from "@emotion/react"
import { DivProps } from "../../global"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { omit } from "../../utils/omit"

interface IMtrInfoButtonProps {
    hover?: boolean
    nonText?: boolean
}

export const MtrInfoButton: React.FC<DivProps<IMtrInfoButtonProps>> = (props) => {
    if (!props.hover) return (
        <CenterBox
            css={css`
                max-width: 500px;
                margin: 0 auto;
                padding: 12px 0;
                border-radius: 8px;
                background-color: #DADDDF;
            `}
            {...omit(props, "children", "hover", "nonText")}
        >
            <TextBox
                size={20}
                color="#909090"
            >
                {props.children}
            </TextBox>
        </CenterBox>
    )

    if (props.nonText) return (
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
            {...omit(props, "children", "hover", "nonText")}
        >
            {props.children}
        </CenterBox>
    )

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
            {...omit(props, "children", "hover", "nonText")}
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