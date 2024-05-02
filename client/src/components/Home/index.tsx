import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { Mentoring } from "./Mentoring"
import { GridBox } from "../common/GridBox"
import { css } from "@emotion/react"
import { IHomeMentoring } from "../../types/mentoring"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { useContext, useState } from "react"
import { currentSemester } from "../../../../models/mentoring"

const defaultMentoringInfo: IHomeMentoring[] = [
    {
        name: "웹 개발",
        code: 25,
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
    const { userInfo } = useContext(UserInfoContext)
    const [MentoringInfo, setMentoringInfo] = useState<IHomeMentoring[]>(defaultMentoringInfo)
    request("mentoring_list", {
        accessToken: userInfo.accessToken,
        semester: currentSemester()
    }).then((res) => {
        if (!res.success) {
            return defaultMentoringInfo
        }
        setMentoringInfo(res.data.map((m) => {
            return {
                name: m.name,
                code: m.code,
                // TODO: studentId to name
                // 아마도 백엔드에서 이름만 담긴 array 따로 주든가 해야할듯
                mentors: m.mentors.map((u) => u.name),
                // TODO : working.start가 미래면 예정된거, 과거면 이미 시작된거 표시
                place: m.working?.location ?? "없음",
                startTime: m.working ? (() => {
                    const { duration } = m.working
                    const start = new Date(m.working.start)
                    const end = new Date(start.getTime() + duration)
                    return `${start.getFullYear()}. ${start.getMonth()}. ${start.getDate()}. `
                        + `${start.getHours()}:${start.getMinutes()}~${end.getHours()}:${end.getMinutes()}`
                })() : "없음",
                isMentee: userInfo.id in m.mentors
            }
        }))
    })

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