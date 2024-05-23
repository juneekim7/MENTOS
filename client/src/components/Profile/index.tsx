import { css } from "@emotion/react"
import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { MentorHistory } from "./MentorHistory"
import { ProfileCard } from "./ProfileCard"
import { MenteeHistory } from "./MenteeHistory"

export const Profile: React.FC = () => {
    return (
        <Content>
            <VBox height={32} />
            <ProfileCard />
            <VBox height={32} css={css`border-bottom: 1px solid var(--nav-border);`} />
            <VBox height={32} />
            <MentorHistory />
            <VBox height={32} />
            <MenteeHistory />
            <VBox height={32} />
        </Content>
    )
}