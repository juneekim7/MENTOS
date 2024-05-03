import { css } from "@emotion/react"
import { HFlexBox, VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuilding, faClock, faUser } from "@fortawesome/free-solid-svg-icons"
import { IHomeMentoring } from "../../types/mentoring"
import { useNavigate } from "react-router-dom"

type IMentoringProps = IHomeMentoring

export const Mentoring: React.FC<IMentoringProps> = (props) => {
    const navigate = useNavigate()

    const textColor = props.isMentee ? "var(--official-text)" : "black"
    const iconColor = props.isMentee ? "var(--official-text)" : "var(--section-icon)"

    return (
        <VFlexBox
            css={css`
                border-radius: 8px;
                background-color: ${props.isMentee ? "var(--mentos-official)" : "var(--mentos-section)" };
                padding: 16px;
                color: ${textColor};
                
                transition: all 0.2s linear;
                :hover {
                    transform: translateY(-5px);
                    background-color: ${props.isMentee ? "var(--mentos-official-dark)" : "var(--mentos-section-dark)"};
                }
            `}
            onClick={() => navigate(`./info/${props.code}`)}
            center
        >
            <HFlexBox gap={4}>
                <TextBox css={css`line-height: 24px;`} inline>{props.code}</TextBox>
                <TextBox weight={600} size={24} inline>{props.name}</TextBox>
            </HFlexBox>
            <VBox height={30} />
            <VFlexBox full gap={8}>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faUser} size="sm" style={{ color: iconColor }} />
                    </VFlexBox>
                    {props.mentors.map((mt) => mt.name).join(", ")}
                </HFlexBox>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faBuilding} size="sm" style={{ color: iconColor }} />
                    </VFlexBox>
                    {props.place}
                </HFlexBox>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faClock} size="sm" style={{ color: iconColor }} />
                    </VFlexBox>
                    {props.startTime}
                </HFlexBox>
            </VFlexBox>
            <VBox
                height={16}
                css={css`
                    border-bottom: 1px dashed ${iconColor};`    
                }
            />
            <VBox height={16} />
            <div css={css`margin: 0 auto;`}>
                <TextBox inline>Start in </TextBox>
                <TextBox size={20} inline>00:00:00</TextBox>
            </div>
        </VFlexBox>
    )
}