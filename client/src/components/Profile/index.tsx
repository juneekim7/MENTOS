import { css } from "@emotion/react"
import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { MentorHistory } from "./MentorHistory"
import { ProfileCard } from "./ProfileCard"
import { MenteeHistory } from "./MenteeHistory"
import { useParams } from "react-router-dom"

export const Profile: React.FC = () => {
    const { id } = useParams()
    if (id === undefined) {
        return (
            <>Error: No Id</>
        )
    }

    return (
        <Content>
            <VBox height={32} />
            <ProfileCard id={id} />
            <VBox height={32} css={css`border-bottom: 1px solid var(--nav-border);`} />
            <VBox height={32} />
            <MentorHistory id={id} />
            <VBox height={32} />
            <MenteeHistory id={id} />
            <VBox height={32} />
        </Content>
    )
}