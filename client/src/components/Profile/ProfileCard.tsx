import { css } from "@emotion/react"
import { VFlexBox } from "../common/FlexBox"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"

export const ProfileCard: React.FC<{ id: string }> = () => {
    return (
        <div>
            <CenterBox
                css={css`
                    width: 40%;
                    aspect-ratio: 1;
                    border-radius: 100vw;
                    overflow: hidden;
                    border: 3px solid #C2C3C4;
                    margin: 0 auto;
                    max-width: 200px;
                `}
            >
                <img src="https://ksain.net/files/stuPhoto/23-031.jpg" alt="프로필 사진" css={css`width: 100%;`} />
            </CenterBox>
            <VBox height={16} />
            <VFlexBox center css={css`width: fit-content; margin: 0 auto;`}>
                <TextBox weight={600} size={24}>
                    김준이
                </TextBox>
                <VBox height={4} />
                <TextBox color="gray">
                    23-031
                </TextBox>
            </VFlexBox>
        </div>
    )
}