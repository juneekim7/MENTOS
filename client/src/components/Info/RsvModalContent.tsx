import { css } from "@emotion/react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { VFlexBox } from "../common/FlexBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { CenterBox } from "../common/CenterBox"
import { EventHandler } from "../../utils/event"
import { TimePicker } from "./TimePicker"
import { ModalCalendar } from "./Calendar"
import { useContext, useState } from "react"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Mentoring } from "../../../../models/mentoring"
import { Input } from "../common/Input"
import { omit } from "../../utils/omit"
import { DivProps } from "../../global"

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

interface RsvModalContentProps {
    info: Mentoring
    forceUpdate: () => void
}

export const RsvModalContent: React.FC<RsvModalContentProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [location, setLocation] = useState("")
    const [day, setDay] = useState<Date>(new Date())
    const [startTime, setStartTime] = useState<Date>(new Date())
    const [endTime, setEndTime] = useState<Date>(new Date(startTime.getTime() + 2 * 60 * 60 * 1000))
    const [page, setPage] = useState<"first" | "second">("first")

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
                멘토링 예약
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
            {page === "first"
                ? <VFlexBox>
                    <TextBox weight={600} size={20}>
                        일시
                    </TextBox>
                    <VBox height={8} />
                    <ModalCalendar day={day} setDay={setDay} />
                    <VBox height={16} />
                    <TimePicker startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} />
                    <VBox height={32} />
                    <Button
                        onClick={() => {
                            const start = new Date(day)
                            start.setHours(startTime.getHours())
                            start.setMinutes(startTime.getMinutes())

                            const end = new Date(day)
                            end.setHours(endTime.getHours())
                            end.setMinutes(endTime.getMinutes())

                            if (start >= end) {
                                alert("종료 시각은 시작 시각 이후여야 합니다.")
                                return
                            }
                            setPage("second")
                        }}
                    >
                        <TextBox
                            size={20}
                            color="white"
                            weight={500}
                        >
                            다음
                        </TextBox>
                    </Button>
                </VFlexBox>
                : <VFlexBox>
                    <TextBox weight={600} size={20}>
                        장소
                    </TextBox>
                    <VBox height={8} />
                    <Input onChange={(e) => setLocation(e.target.value)} />
                    <VBox height={32} />
                    <Button
                        onClick={async () => {
                            if (location === "") {
                                alert("장소를 입력해주세요.")
                                return
                            }

                            const start = new Date(day)
                            start.setHours(startTime.getHours())
                            start.setMinutes(startTime.getMinutes())

                            const end = new Date(day)
                            end.setHours(endTime.getHours())
                            end.setMinutes(endTime.getMinutes())

                            const res = await request("mentoring_reserve", {
                                accessToken: userInfo.accessToken,
                                code: props.info.code,
                                plan: {
                                    location,
                                    start,
                                    end
                                }
                            })

                            if (!res.success) console.log(res.error)
                            else {
                                EventHandler.trigger("modal", null)
                                props.forceUpdate()
                            }
                        }}
                    >
                        <TextBox
                            size={20}
                            color="white"
                            weight={500}
                        >
                            예약
                        </TextBox>
                    </Button>
                </VFlexBox>}
        </div>
    )
}