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
    onSlideChange: (swiper: SwiperClass) => void
    values: number[]
}

const TimeSwiper: React.FC<ITimeSwiperProps> = (props) => {
    return (
        <Swiper
            css={css`height: 72px;`}
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

export const TimePicker = () => {
    return (
        <HFlexBox gap={24} center css={css`margin: 0 auto;`}>
            <HFlexBox gap={8} center>
                <TimeSwiper
                    onSlideChange={(swiper) => swiper.realIndex}
                    values={HOURS}
                />
                <TextBox weight={600} size={20}>
                    :
                </TextBox>
                <TimeSwiper
                    onSlideChange={(swiper) => swiper.realIndex}
                    values={MINUTES}
                />
            </HFlexBox>
            <TextBox weight={600} size={24}>
                ~
            </TextBox>
            <HFlexBox gap={8} center>
                <TimeSwiper
                    onSlideChange={(swiper) => swiper.realIndex}
                    values={HOURS}
                />
                <TextBox weight={600} size={20}>
                    :
                </TextBox>
                <TimeSwiper
                    onSlideChange={(swiper) => swiper.realIndex}
                    values={MINUTES}
                />
            </HFlexBox>
        </HFlexBox>
        
    )
}