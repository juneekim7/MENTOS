import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { Mentoring } from "./Mentoring"
import { GridBox } from "../common/GridBox"
import { css } from "@emotion/react"
import { IHomeMentoring } from "../types/mentoring"

const MentoringInfo: IHomeMentoring[] = [
    {
        name: "웹 개발",
        code: 12,
        mentors: ["김준이", "문가온"],
        place: "형설관 3511",
        startTime: "2024. 03. 30. 20:00~22:00",
        isMentee: true
    },
    {
        name: "정보과학1",
        code: 46,
        mentors: ["김창하", "문가온"],
        place: "형설관 3511",
        startTime: "2024. 03. 30. 20:00~22:00",
        isMentee: true
    },
    {
        name: "정보과학1",
        code: 46,
        mentors: ["김창하", "문가온"],
        place: "형설관 3511",
        startTime: "2024. 03. 30. 20:00~22:00",
        isMentee: false   
    }
]

export const Home: React.FC = () => {
    return (
        <Content>
            <VBox height={32} />
            <GridBox
                gap={16}
                css={css`
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                `}
            >
                {MentoringInfo.map((v, i) => <Mentoring key={i} {...v} />)}
            </GridBox>
        </Content>
    )
}