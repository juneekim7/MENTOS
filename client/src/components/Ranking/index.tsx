import { css } from "@emotion/react"
import { Content } from "../common/Content"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { DivisonSelector } from "./DivisionSelector"
import { useContext, useEffect, useState } from "react"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { RankMentoring, toMentoringRanking } from "../../utils/mentoring"
import { RankUser, toUserRanking } from "../../utils/user"
import { MentoringLink, ProfileLink } from "../common/Link"
import { CenterBox } from "../common/CenterBox"

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

export type TDivision = "mentor" | "mentee"

export const Ranking: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [ mentoringRanking, setMentoringRanking ] = useState<RankMentoring[]>([])
    const [ userRanking, setUserRanking ] = useState<RankUser[]>([])
    const [ division, setDivision ] = useState<TDivision>("mentor")

    useEffect(() => {
        (async () => {
            if (userInfo.accessToken === "") return

            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken
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
            <DivisonSelector setDivision={setDivision} division={division} />
            <VBox height={8} />
            {division === "mentor"
                ? <table css={css`width: 100%; border-collapse: collapse;`}>
                    <thead>
                        <TableElement.Row>
                            <TableElement.Head>#</TableElement.Head>
                            <TableElement.Head>멘토링</TableElement.Head>
                            <TableElement.Head>활동 시간</TableElement.Head>
                        </TableElement.Row>
                    </thead>
                    <tbody>
                        {mentoringRanking.map((mtr, index) =>
                            <TableElement.Row key={index}>
                                <TableElement.Data>{index + 1}</TableElement.Data>
                                <TableElement.Data>
                                    <CenterBox>
                                        <MentoringLink name={mtr.name} code={mtr.code} />
                                    </CenterBox>
                                </TableElement.Data>
                                <TableElement.Data>{Math.floor(mtr.time / (60 * 60 * 1000))}h {Math.floor(mtr.time / (60 * 1000) % 60)}m</TableElement.Data>
                            </TableElement.Row>)}
                    </tbody>
                </table>
                : <table css={css`width: 100%; border-collapse: collapse;`}>
                    <thead>
                        <TableElement.Row>
                            <TableElement.Head>#</TableElement.Head>
                            <TableElement.Head>이름</TableElement.Head>
                            <TableElement.Head>참여 횟수</TableElement.Head>
                        </TableElement.Row>
                    </thead>
                    <tbody>
                        {userRanking.map((user, index) =>
                            <TableElement.Row key={index}>
                                <TableElement.Data>{index + 1}</TableElement.Data>
                                <TableElement.Data>
                                    <CenterBox>
                                        <ProfileLink id={user.id} name={user.name} />
                                    </CenterBox>
                                </TableElement.Data>
                                <TableElement.Data>{user.part}회</TableElement.Data>
                            </TableElement.Row>)}
                    </tbody>
                </table>}
            <VBox height={32} />
        </Content>
    )
}