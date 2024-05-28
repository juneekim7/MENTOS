import { css } from "@emotion/react"
import { HFlexBox, VFlexBox } from "../common/FlexBox"
import { VBox } from "../common/VBox"
import { TextBox } from "../common/TextBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder, faHourglass, faUser } from "@fortawesome/free-solid-svg-icons"
import { Log, Mentoring } from "../../../../models/mentoring"
import { ProfileLink } from "../common/Link"

const format = (logs: Log[]) => {
    let accTime = 0
    for (const log of logs) {
        const sDate = new Date(log.start)
        const eDate = new Date(log.end)
        accTime += (eDate.getTime() - sDate.getTime()) / 60000
    }
    const hour = Math.floor(accTime / 60)
    const minute = Math.floor(accTime - 60 * hour)
    return `${hour}h ${minute}m`
}

export const MentoringScreen: React.FC<Mentoring> = (props) => {
    return (
        <VFlexBox
            css={css`
                border-radius: 8px;
                background-color: var(--mentos-section);
                padding: 16px;
                max-width: 500px;
                margin: 0 auto;
            `}
            center
        >
            <HFlexBox gap={4}>
                <TextBox css={css`line-height: 24px;`} inline>{props.code}</TextBox>
                <TextBox weight={600} size={24} inline>{props.name}</TextBox>
            </HFlexBox>
            <VBox height={30} />
            <VFlexBox full gap={8}>
                <HFlexBox center>
                    <VFlexBox css={css`width: 14px; margin-right: 4px;`} center>
                        <FontAwesomeIcon icon={faUser} size="sm" style={{ color: "var(--section-icon)" }} />
                    </VFlexBox>
                    {props.mentors.slice(0, 3).map((mt, i, origin) =>
                        <ProfileLink
                            key={i}
                            name={mt.name}
                            id={mt.id}
                            addComma={i < origin.length - 1 || props.mentors.length > 3}
                            underline
                        />)}
                    {props.mentors.length > 3 && <div>
                        ...
                    </div>}
                </HFlexBox>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faFolder} size="sm" style={{ color: "var(--section-icon)" }} />
                    </VFlexBox>
                    {props.classification === "academic" ? "학업 멘토링" : "장인 멘토링"}
                </HFlexBox>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faHourglass} size="sm" style={{ color: "var(--section-icon)" }} />
                    </VFlexBox>
                    {format(props.logs)}
                </HFlexBox>
            </VFlexBox>
        </VFlexBox>
    )
}