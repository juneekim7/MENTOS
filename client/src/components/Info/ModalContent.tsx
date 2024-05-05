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
import { Mentoring, maxDuration } from "../../../../models/mentoring"

interface IModalContentProps {
    info: Mentoring
}

export const ModalContent: React.FC<IModalContentProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [location, setLocation] = useState("")
    const [day, setDay] = useState<Date>(new Date())
    const [startTime, setStartTime] = useState<Date>(new Date())
    const [endTime, setEndTime] = useState<Date>(new Date(startTime.getTime() + 2 * 60 * 60 * 1000))

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
            <VFlexBox gap={16}>
                {/* <div>
                    <TextBox weight={600} size={20}>
                        일시
                    </TextBox>
                    <VBox height={4} />
                </div> */}
                <ModalCalendar day={day} setDay={setDay} />
                <input placeholder="장소" onChange={(e) => setLocation(e.target.value)} />
                <TimePicker startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} />
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
                >
                    <TextBox
                        size={20}
                        color="white"
                        weight={500}
                        onClick={async () => {
                            const start = new Date(day)
                            start.setHours(startTime.getHours())
                            start.setMinutes(startTime.getMinutes())

                            const end = new Date(day)
                            end.setHours(endTime.getHours())
                            end.setMinutes(endTime.getMinutes())

                            if (location === "") {
                                alert("장소가 없어용 ㅠㅠ.")
                                return
                            }
                            if (start >= end) {
                                alert("끝나는 시각은 시작 시각보다 미래여야 합니다.")
                                return
                            }
                            if (end.getTime() - start.getTime() > maxDuration) {
                                alert(`멘토링은 최대 ${maxDuration / (60 * 60 * 1000)}시간까지만 가능합니다.`)
                                return
                            }

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
                            EventHandler.trigger("modal", null)
                        }}
                    >
                        예약하기
                    </TextBox>
                </CenterBox>
            </VFlexBox>

        </div>
    )
}