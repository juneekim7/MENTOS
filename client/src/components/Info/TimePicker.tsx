import { Swiper, SwiperClass, SwiperSlide } from "swiper/react"
import { TextBox } from "../common/TextBox"
import { css } from "@emotion/react"
import { Mousewheel } from "swiper/modules"
import { HFlexBox } from "../common/FlexBox"
import { CenterBox } from "../common/CenterBox"
import "swiper/css"

const HOURS = new Array(24).fill(0).map((_v, i) => i)
const MINUTES = new Array(12).fill(0).map((_v, i) => 5 * i)

interface ITimeSwiperProps {
    initialSlide: number
    onSlideChange: (swiper: SwiperClass) => void
    values: number[]
}

const TimeSwiper: React.FC<ITimeSwiperProps> = (props) => {
    return (
        <Swiper
            css={css`height: 72px;`}
            initialSlide={props.initialSlide}
            direction="vertical"
            slidesPerView={2}
            mousewheel={{
                enabled: true,
                sensitivity: 0.5
            }}
            loop
            loopAdditionalSlides={5}
            slideToClickedSlide
            centeredSlides
            freeMode={{
                enabled: false,
                momentumRatio: 0.25,
                momentumVelocityRatio: 0.25,
                minimumVelocity: 0.1,
                sticky: true
            }}
            modules={[Mousewheel]}
            onSlideChange={props.onSlideChange}
        >
            {props.values.map((v) => (
                <SwiperSlide key={v}>
                    {(data) =>
                        <CenterBox css={css`width: 100%; height: 36px;`}>
                            <TextBox weight={600} size={30} center
                                css={css`
                                    font-variant-numeric: tabular-nums;
                                    opacity: ${data.isActive ? 1 : 0.25};
                                `}
                            >
                                {v.toString().padStart(2, "0")}
                            </TextBox>
                        </CenterBox>}
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

interface ITimePickerProps {
    startTime: Date
    setStartTime: React.Dispatch<React.SetStateAction<Date>>
    endTime: Date
    setEndTime: React.Dispatch<React.SetStateAction<Date>>
}

export const TimePicker: React.FC<ITimePickerProps> = (props) => {

    return (
        <HFlexBox gap={24} center css={css`margin: 0 auto;`}>
            <HFlexBox gap={8} center>
                <TimeSwiper
                    initialSlide={props.startTime.getHours()}
                    onSlideChange={(swiper) => {
                        const hours = swiper.realIndex
                        const newStartTime = new Date(props.startTime.getTime())
                        newStartTime.setHours(hours)
                        props.setStartTime(newStartTime)
                    }}
                    values={HOURS}
                />
                <TextBox weight={600} size={20}>
                    :
                </TextBox>
                <TimeSwiper
                    initialSlide={Math.ceil(props.startTime.getMinutes() / 5)}
                    onSlideChange={(swiper) => {
                        const minutes = swiper.realIndex * 5
                        const newStartTime = new Date(props.startTime.getTime())
                        newStartTime.setMinutes(minutes)
                        props.setStartTime(newStartTime)
                    }}
                    values={MINUTES}
                />
            </HFlexBox>
            <TextBox weight={600} size={24}>
                ~
            </TextBox>
            <HFlexBox gap={8} center>
                <TimeSwiper
                    initialSlide={props.endTime.getHours()}
                    onSlideChange={(swiper) => {
                        const hours = swiper.realIndex
                        const newEndTime = new Date(props.endTime.getTime())
                        newEndTime.setHours(hours)
                        props.setEndTime(newEndTime)
                    }}
                    values={HOURS}
                />
                <TextBox weight={600} size={20}>
                    :
                </TextBox>
                <TimeSwiper
                    initialSlide={Math.ceil(props.startTime.getMinutes() / 5)}
                    onSlideChange={(swiper) => {
                        const minutes = swiper.realIndex * 5
                        const newEndTime = new Date(props.endTime.getTime())
                        newEndTime.setMinutes(minutes)
                        props.setEndTime(newEndTime)
                    }}
                    values={MINUTES}
                />
            </HFlexBox>
        </HFlexBox>

    )
}