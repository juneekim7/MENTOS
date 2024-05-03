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
import { intervalFormat } from "../../utils/time"

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
                    place: mtr.working
                        ? mtr.working.location
                        : (mtr.plan 
                            ? mtr.plan.location
                            : "-"),
                    plan: mtr.plan !== null
                        ? intervalFormat(new Date(mtr.plan.start), new Date(mtr.plan.end)) 
                        : "-",
                    isMentee: mtr.mentees.some((mte) => mte.id === userInfo.id),
                    isMentor: mtr.mentors.some((mtr) => mtr.id === userInfo.id),
                    hasStarted: mtr.working !== null
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
                {MentoringInfo
                    .filter((v) => v.isMentor)
                    .sort((a, b) => a.code - b.code)
                    .map((v, i) => <Mentoring key={`mentor-${i}`} {...v} />)}
                {MentoringInfo
                    .filter((v) => !v.isMentor && v.isMentee)
                    .sort((a, b) => a.code - b.code)
                    .map((v, i) => <Mentoring key={`mentee-${i}`} {...v} />)}
                {MentoringInfo
                    .filter((v) => !v.isMentor && !v.isMentee)
                    .sort((a, b) => a.code - b.code)
                    .map((v, i) => <Mentoring key={`normal-${i}`} {...v} />)}
            </GridBox>
            <VBox height={32} />
        </Content>
    )
}