import { Fragment, useContext, useEffect, useState } from "react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { MentoringLink } from "../common/Link"
import { HFlexBox } from "../common/FlexBox"
import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { UserInfoContext } from "../context/User"
import { Mentoring } from "../../../../models/mentoring"
import { LogWithMentoringInfo } from "."
import { request } from "../../utils/connection"

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
                    font-variant-numeric: tabular-nums;
                `}
            >
                {props.children}
            </td>
        )
    }
}

export const MenteeHistory: React.FC<{ id: string }> = (props) => {
    const { id } = props
    const { userInfo } = useContext(UserInfoContext)
    const [mentorings, setMentorings] = useState<Mentoring[]>([])
    const [logs, setLogs] = useState<LogWithMentoringInfo[]>([])
    useEffect(() => {
        (async () => {
            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken
            }, true)

            if (!res.success) return
            setMentorings(res.data.filter(
                (men) => men.mentees.find((user) => user.id === id)
            ))
            setLogs(
                mentorings.reduce<LogWithMentoringInfo[]>(
                    (acc, men) => acc.concat(men.logs.filter((log) => log.attend.find(
                        (user) => user.id === id
                    )).map((log) => {
                        return {
                            ...log,
                            start: new Date(log.start),
                            mentoringName: men.name,
                            mentoringCode: men.code
                        }
                    })), []
                ).reverse()
            )
        })()
    }, [id, userInfo, mentorings])
    return (
        <Fragment>
            <TextBox weight={700} size={24}>
                멘티 활동 내역
            </TextBox>
            <VBox height={8} />
            <HFlexBox center>
                <TextBox weight={500}>참여 횟수 : </TextBox>
                <TextBox>{logs.length}회</TextBox>
            </HFlexBox>
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    {logs.length === 0
                        ? <TableElement.Row /> 
                        : <TableElement.Row>
                            <TableElement.Head>#</TableElement.Head>
                            <TableElement.Head>멘토링</TableElement.Head>
                            <TableElement.Head>일시</TableElement.Head>
                        </TableElement.Row>}
                </thead>
                <tbody>
                    {logs.length === 0
                        ? <TableElement.Row>
                            <TableElement.Data>
                                <TextBox
                                    weight={500}
                                    size={18}
                                    css={css`line-height: 24px;`}
                                    color="#808080"
                                    center
                                >
                                    해당 학기에 멘티로 활동한 기록이 없습니다.
                                </TextBox>
                            </TableElement.Data>    
                        </TableElement.Row>
                        : logs.map((log, index) =>
                            <TableElement.Row>
                                <TableElement.Data>{index + 1}</TableElement.Data>
                                <TableElement.Data>
                                    <CenterBox>
                                        <MentoringLink name={log.mentoringName} code={log.mentoringCode} />
                                    </CenterBox>
                                </TableElement.Data>
                                <TableElement.Data>{log.start.getFullYear()}.{log.start.getMonth() + 1}.{log.start.getDate()}</TableElement.Data>
                            </TableElement.Row>)}
                </tbody>
            </table>
        </Fragment>
    )
}