import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { Mentoring } from "./Mentoring"
import { GridBox } from "../common/GridBox"
import { css } from "@emotion/react"
import { IHomeMentoring } from "../../types/mentoring"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { useContext, useEffect, useState } from "react"
import { currentSemester } from "../../../../models/mentoring"

const defaultMentoringInfo: IHomeMentoring[] = []

export const Home: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [ MentoringInfo, setMentoringInfo ] = useState<IHomeMentoring[]>(defaultMentoringInfo)

    useEffect(() => {
        (async () => {
            if (userInfo.accessToken === "") return

            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken,
                semester: currentSemester()
            })

            if (!res.success) return // TODO: Error

            setMentoringInfo(
                res.data.map((mtr) => ({
                    code: mtr.code,
                    name: mtr.name,
                    mentors: mtr.mentors,
                    place: mtr.working?.location ?? "-",
                    startTime: mtr.working ? (() => {
                        const { duration } = mtr.working
                        const start = new Date(mtr.working.start)
                        const end = new Date(start.getTime() + duration)
                        return `${start.getFullYear()}. ${start.getMonth()}. ${start.getDate()}. `
                            + `${start.getHours()}:${start.getMinutes()}~${end.getHours()}:${end.getMinutes()}`
                    })() : "-",
                    isMentee: mtr.mentees.some((mte) => mte.id === userInfo.id)
                }))
            )
        })()
    }, [userInfo])
    
    return (
        <Content>
            <VBox height={32} />
            <GridBox
                gap={16}
                css={css`grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));`}
            >
                {MentoringInfo.map((v, i) => <Mentoring key={i} {...v} />)}
            </GridBox>
        </Content>
    )
}