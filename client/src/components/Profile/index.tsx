import { css } from "@emotion/react"
import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { MentorHistory } from "./MentorHistory"
import { ProfileCard } from "./ProfileCard"
import { MenteeHistory } from "./MenteeHistory"
import { useParams } from "react-router-dom"
import { Log } from "../../../../models/mentoring"

export interface LogWithMentoringInfo extends Log {
    mentoringName: string
    mentoringCode: number
}

export const Profile: React.FC = () => {
    const { stdid } = useParams()
    if (stdid === undefined) {
        return (
            <>Error: No Id</>
        )
    }

    return (
        <Content>
            <VBox height={32} />
            <ProfileCard id={stdid} />
            <VBox height={32} css={css`border-bottom: 1px solid var(--nav-border);`} />
            <VBox height={32} />
            <MentorHistory id={stdid} />
            <VBox height={32} />
            <MenteeHistory id={stdid} />
            <VBox height={32} />
        </Content>
    )
}