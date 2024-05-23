import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { GridBox } from "../common/GridBox"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Mentoring } from "../../../../models/mentoring"
import { useEffect, useRef, useState } from "react"
import { milliToHMS } from "../../utils/time"
import { MtrInfoButton } from "./MtrInfoButton"
import { EndModalContent } from "./EndModalContent"
import { EventHandler } from "../../utils/event"

interface FinishProps {
    info: Mentoring
    forceUpdate: () => void
}

export const Finish: React.FC<FinishProps> = (props) => {
    const intervalRef = useRef<NodeJS.Timeout>()
    const [ timer, setTimer ] = useState("00:00:00")
    
    useEffect(() => {
        const { working } = props.info
        if (working === null) return

        intervalRef.current = setInterval(() => {
            setTimer(
                milliToHMS(Date.now() - (new Date(working.start)).getTime())
            )
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [props.info])

    return (
        <MtrInfoButton
            hover
            nonText
            onClick={() => EventHandler.trigger("modal", <EndModalContent {...props} />)}
        >
            <GridBox column={2} css={css`width: 100%;`}>
                <CenterBox css={css`border-right: 1px dashed white;`}>
                    <TextBox
                        weight={700}
                        size={28}
                        color="white"
                    >
                        종료
                    </TextBox>
                </CenterBox>
                <CenterBox>
                    <FontAwesomeIcon
                        icon={faClock}
                        style={{
                            color: "white",
                            marginRight: 8
                        }}
                        size="lg"
                    />
                    <TextBox
                        weight={400}
                        size={20}
                        color="white"
                        inline
                        css={css`font-variant-numeric: tabular-nums;`}
                    >
                        +{timer}
                    </TextBox>
                </CenterBox>
            </GridBox>
        </MtrInfoButton>
    )
}