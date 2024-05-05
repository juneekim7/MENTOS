import { css } from "@emotion/react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { VFlexBox } from "../common/FlexBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { CenterBox } from "../common/CenterBox"
import { EventHandler } from "../../utils/event"

export const ModalContent: React.FC = () => {
    return (
        <div
            css={css`
                background-color: white;
                padding: 16px;
                border-radius: 8px;
                
                box-sizing: border-box;
                width: 80vw;
                max-width: 500px;
                position: relative;
            `}
        >
            <TextBox weight={600} size={24} center>
                멘토링 예약하기
            </TextBox>
            <CenterBox
                css={css`
                    position: absolute;
                    right: 12px;
                    top: 12px;
                    width: 30px;
                    height: 30px;
                    box-sizing: border-box;
                    border-radius: 6px;
                    cursor: pointer;

                    :hover {
                        background-color: var(--nav-hover);
                    }
                `}
                onClick={() => EventHandler.trigger("modal", null)}
            >
                <FontAwesomeIcon
                    icon={faXmark}
                    size="xl"
                    color="#808080"
                />
            </CenterBox>
            <VBox height={32} />
            <VFlexBox gap={16}>
                <div>
                    <TextBox weight={600} size={20}>
                        멘토링
                    </TextBox>
                    <VBox height={4} />
                    10. 시그마 정멘
                </div>
                <div>
                    <TextBox weight={600} size={20}>
                        일시
                    </TextBox>
                    <VBox height={4} />
                    10. 시그마 정멘
                </div>
            </VFlexBox>
            
        </div>
    )
}