import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"

export const MentorButton: React.FC = () => {
    const []

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
        >
            <TextBox
                weight={700}
                size={28}
                color="white"
            >
                출석
            </TextBox>
        </CenterBox>
    ) 
}