import { css } from "@emotion/react"
import { HFlexBox, VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuilding, faClock, faUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { Mentoring } from "../../../../models/mentoring"
import { UserInfoContext } from "../context/User"
import { isMentee, isMentor } from "../../utils/mentoring"
import { timeFormat, milliToHMS } from "../../utils/time"
import { ProfileLink } from "../common/Link"

export const MentoringMain: React.FC<Mentoring> = (props) => {
    const navigate = useNavigate()
    const { userInfo } = useContext(UserInfoContext)
    const intervalRef = useRef<NodeJS.Timeout>()
    const [timer, setTimer] = useState("00:00:00")

    useEffect(() => {
        const { plan } = props
        if (plan === null) return

        intervalRef.current = setInterval(() => {
            setTimer(
                milliToHMS((new Date(plan.start)).getTime() - Date.now())
            )
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [props])

    const textColor = isMentee(props, userInfo) || isMentor(props, userInfo) ? "var(--official-text)" : "black"
    const iconColor = isMentee(props, userInfo) || isMentor(props, userInfo) ? "var(--official-text)" : "var(--section-icon)"
    const bgColor = isMentor(props, userInfo)
        ? "var(--mentos-blue)"
        : (isMentee(props, userInfo)
            ? "var(--mentos-official)"
            : "var(--mentos-section)")
    const hoverColor = isMentor(props, userInfo)
        ? "var(--mentos-blue-dark)"
        : (isMentee(props, userInfo)
            ? "var(--mentos-official-dark)"
            : "var(--mentos-section-dark)")

    return (
        <VFlexBox
            css={css`
                border-radius: 8px;
                background-color: ${bgColor};
                padding: 16px;
                color: ${textColor};
                
                transition: all 0.2s linear;
                :hover {
                    transform: translateY(-5px);
                    background-color: ${hoverColor};
                    cursor: pointer;
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
                <HFlexBox center>
                    <VFlexBox css={css`width: 14px; margin-right: 4px;`} center>
                        <FontAwesomeIcon icon={faUser} size="sm" style={{ color: iconColor }} />
                    </VFlexBox>
                    {props.mentors.slice(0, 3).map((mt, i, origin) =>
                        <ProfileLink
                            key={i}
                            name={mt.name}
                            id={mt.id}
                            addComma={i < origin.length - 1 || props.mentors.length > 3}
                        />)}
                    {props.mentors.length > 3 && <div>
                        ...
                    </div>}
                </HFlexBox>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faBuilding} size="sm" style={{ color: iconColor }} />
                    </VFlexBox>
                    {props.working?.location ?? props.plan?.location ?? "-"}
                </HFlexBox>
                <HFlexBox gap={4} center>
                    <VFlexBox css={css`width: 14px;`} center>
                        <FontAwesomeIcon icon={faClock} size="sm" style={{ color: iconColor }} />
                    </VFlexBox>
                    {props.working !== null
                        ? timeFormat(new Date(props.working.start))
                        : (props.plan !== null
                            ? timeFormat(new Date(props.plan.start))
                            : "-")}
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
                {props.working !== null
                    ? <TextBox size={20} weight={700}>진행 중...</TextBox>
                    : <Fragment>
                        <TextBox inline>시작까지 </TextBox>
                        {props.plan === null
                            ? <TextBox size={20} inline>--:--:--</TextBox>
                            : <TextBox size={20} inline>{timer}</TextBox>}
                    </Fragment>}
            </div>
        </VFlexBox>
    )
}