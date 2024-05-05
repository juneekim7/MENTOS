import { css } from "@emotion/react"
import { Content } from "../common/Content"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { DivisonSelector } from "./DivisionSelector"
import { useContext, useEffect, useState } from "react"
import { currentSemester } from "../../../../models/mentoring"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { RankMentoring, toMentoringRanking } from "../../utils/mentoring"
import { RankUser, toUserRanking } from "../../utils/user"

namespace TableElement {
    export const Row: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <tr css={css`border-bottom: 1px solid var(--nav-border);`}>
                {props.children}
            </tr>
        )
    }

    export const Head: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <th
                css={css`
                    font-weight: 700;
                    text-align: center;
                    padding: 8px;
                `}
            >
                {props.children}
            </th>
        )
    }

    export const Data: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <td
                css={css`
                    text-align: center;
                    padding: 8px;
                    line-height: 24px;
                `}
            >
                {props.children}
            </td>
        )
    }
}

export const Ranking: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [MentoringRanking, setMentoringRanking] = useState<RankMentoring[]>([])
    const [UserRanking, setUserRanking] = useState<RankUser[]>([])

    useEffect(() => {
        (async () => {
            if (userInfo.accessToken === "") return

            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken,
                semester: currentSemester()
            })

            if (!res.success) return // TODO: Error
            setMentoringRanking(toMentoringRanking(res.data))
            setUserRanking(toUserRanking(res.data))
        })()
    }, [userInfo])
    return (
        <Content>
            <VBox height={32} />
            <TextBox size={24} weight={700}>
                랭킹
            </TextBox>
            <VBox height={8} />
            <DivisonSelector />
            <VBox height={8} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>#</TableElement.Head>
                        <TableElement.Head>멘토링</TableElement.Head>
                        <TableElement.Head>활동 시간</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    {
                        MentoringRanking.map((mtr, index) => <TableElement.Row>
                            <TableElement.Data>{index + 1}</TableElement.Data>
                            <TableElement.Data>{mtr.name}</TableElement.Data>
                            <TableElement.Data>{Math.floor(mtr.time / (60 * 60 * 1000))}h {Math.floor(mtr.time / (60 * 1000) % 60)}m</TableElement.Data>
                        </TableElement.Row>)
                    }
                </tbody>
            </table>
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>#</TableElement.Head>
                        <TableElement.Head>학번/이름</TableElement.Head>
                        <TableElement.Head>참여 횟수</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    {
                        UserRanking.map((user, index) => <TableElement.Row>
                            <TableElement.Data>{index + 1}</TableElement.Data>
                            <TableElement.Data>{user.id} {user.name}</TableElement.Data>
                            <TableElement.Data>{user.part}회</TableElement.Data>
                        </TableElement.Row>)
                    }
                </tbody>
            </table>
        </Content>
    )
}