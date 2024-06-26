import { Content } from "../common/Content"
import { VBox } from "../common/VBox"
import { MentoringMain } from "./MentoringMain"
import { GridBox } from "../common/GridBox"
import { css } from "@emotion/react"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { useContext, useEffect, useState } from "react"
import { Mentoring } from "../../../../models/mentoring"
import { isMentee, isMentor } from "../../utils/mentoring"

const mentoringSort = (a: Mentoring, b: Mentoring) => {
    if (a.working === null && b.working !== null) return 1
    if (a.working !== null && b.working === null) return -1
    if (a.plan === null && b.plan !== null) return 1
    if (a.plan !== null && b.plan === null) return -1
    return a.code - b.code
}

export const Home: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [ MentoringInfo, setMentoringInfo ] = useState<Mentoring[]>([])

    useEffect(() => {
        (async () => {
            if (userInfo.accessToken === "") return

            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken
            }, true)

            if (!res.success) return // TODO: Error
            setMentoringInfo(res.data)
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
                    .filter((v) => isMentor(v, userInfo))
                    .sort(mentoringSort)
                    .map((v, i) => <MentoringMain key={`mentor-${i}`} {...v} />)}
                {MentoringInfo
                    .filter((v) => !isMentor(v, userInfo) && isMentee(v, userInfo))
                    .sort(mentoringSort)
                    .map((v, i) => <MentoringMain key={`mentee-${i}`} {...v} />)}
                {MentoringInfo
                    .filter((v) => !isMentor(v, userInfo) && !isMentee(v, userInfo))
                    .sort(mentoringSort)
                    .map((v, i) => <MentoringMain key={`normal-${i}`} {...v} />)}
            </GridBox>
            <VBox height={32} />
        </Content>
    )
}