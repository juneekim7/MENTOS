import { css } from "@emotion/react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { HFlexBox, VFlexBox } from "../common/FlexBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { CenterBox } from "../common/CenterBox"
import { EventHandler } from "../../utils/event"
import { useContext, useState } from "react"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Mentoring } from "../../../../models/mentoring"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import { imageToBase64 } from "../../utils/image"

const Button: React.FC<DivProps> = (props) => {
    return (
        <CenterBox
            css={css`
                margin: 0 auto;
                padding: 12px 24px;
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
            {props.children}
        </CenterBox>
    )
}

interface EndModalContentProps {
    info: Mentoring
    forceUpdate: () => void
}

export const EndModalContent: React.FC<EndModalContentProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [image, setImage] = useState<string | null>(null)

    return (
        <div
            css={css`
                background-color: white;
                padding: 16px;
                border-radius: 8px;
                
                box-sizing: border-box;
                width: 90vw;
                max-width: 500px;
                position: relative;
            `}
            onClick={(e) => e.stopPropagation()}
        >
            <TextBox weight={600} size={24} center>
                멘토링 종료
            </TextBox>
            <VBox height={4} />
            <TextBox center color="gray">
                - {props.info.code}. {props.info.name}
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
            <VFlexBox center>
                <div css={css`width: 100%;`}>
                    <TextBox weight={600} size={20}>
                        종료 사진
                    </TextBox>
                    <VBox height={4} />
                    <TextBox size={12} color="red">
                        주의 : https://vclock.kr/을 이용해주세요.
                    </TextBox>
                </div>
                <VBox height={8} />
                <CenterBox
                    css={css`
                        width: 100%;
                        aspect-ratio: 16 / 9;
                        overflow: hidden;
                    `}
                >
                    {image === null
                        ? <CenterBox
                            css={css`
                                width: 100%;
                                height: 100%;
                                background-color: var(--mentos-section);
                            `}
                        >
                            미리보기 없음
                        </CenterBox>
                        : <img
                            src={image}
                            css={css`
                                width: 100%;
                                object-fit: scale-down;
                            `}
                        />}
                </CenterBox>
                <VBox height={16} />
                <HFlexBox gap={16}>
                    <label
                        css={css`
                            margin: 0 auto;
                            padding: 12px 24px;
                            border-radius: 8px;
                            background-color: ${image === null ? "var(--mentos-official)" : "#DDDFE0"};
                            transition: all 0.3s linear;
                            cursor: pointer;
            
                            :hover {
                                background-color: #C2C3C4;
                                transform: translateY(-5px);
                            }
                        `}
                    >
                        <TextBox
                            size={20}
                            weight={500}
                            color={image === null ? "white" : "black"}
                        >
                            {image === null ? "파일 선택" : "파일 변경"}
                        </TextBox>
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            css={css`
                                display: block;
                                width: 0;
                                height: 0;
                                overflow: hidden;
                            `}
                            onChange={async (e) => {
                                if (e.target.files === null) return
                                const res = await imageToBase64(e.target.files[0])
                                setImage(res)
                            }}
                        />
                    </label>
                    {image !== null &&
                        <Button
                            onClick={async () => {
                                const res = await request("mentoring_end", {
                                    accessToken: userInfo.accessToken,
                                    code: props.info.code,
                                    endImage: image
                                })

                                if (!res.success) console.log(res.error)
                                else {
                                    EventHandler.trigger("modal", null)
                                    props.forceUpdate()
                                }
                            }}
                        >
                            <TextBox size={20} weight={500} color="white">종료</TextBox>
                        </Button>}
                </HFlexBox>
            </VFlexBox>
        </div>
    )
}