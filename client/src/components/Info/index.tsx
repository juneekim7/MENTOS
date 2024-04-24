import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { Attendance } from "./Attendance"
import { History } from "./History"
import { Mentoring } from "./Mentoring"

const info = {
    code: 13,
    name: "웹 개발",
    class: "장인 멘토링",
    accumulatedTime: 130,
    ranking: 2,
    mentors: ["김준이", "문가온"]
}

export const MentoringInfo: React.FC = () => {
    return (
        <Content>
            <VBox height={32} />
            <Mentoring {...info} />
            <VBox height={16} />
            <Attendance />
            <VBox height={48} />
            <History />
        </Content>
    )
}