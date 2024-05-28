import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { css } from "@emotion/react"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { Mentoring, Semester } from "../../../../models/mentoring"
import { MentoringLink, ProfileLink } from "../common/Link"
import { CenterBox } from "../common/CenterBox"
import { GridBox } from "../common/GridBox"
import { Button } from "../common/Button"
import { Input } from "../common/Input"

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

export const AdminMentorings: React.FC<{ defaultSemester: Semester }> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [semester, setSemester] = useState<Semester>(props.defaultSemester)
    const [mentorings, setMentorings] = useState<Mentoring[]>([])
    const [r, rerender] = useState({})
    const forceUpdate = useCallback(() => rerender({}), [])

    useEffect(() => {
        (async () => {
            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken,
                semester
            })

            if (!res.success) return
            setMentorings(res.data)
        })()
    }, [semester, userInfo, r])

    return (
        <Fragment>
            <TextBox weight={600} size={20}>
                학기
            </TextBox>
            <VBox height={8} />
            <Input
                placeholder="학기(20XX-X)"
                defaultValue={props.defaultSemester}
                onChange={(e) => {
                    if (/20\d\d-[12]/.test(e.target.value)) setSemester(e.target.value as Semester)
                }}
                css={css`display: inline;`}
            />
            <VBox height={32} />
            <TextBox weight={600} size={20}>
                멘토링 추가하기
            </TextBox>
            <VBox height={8} />
            {/* 파일 예시:
            <textarea
                readOnly={true}
                placeholder={
                    "1\n멘토링1\n00-001 00-002\n00-003 00-004 00-005 00-006 00-007\nacademic\n"
                    + "2\n멘토링2\n00-001 00-002\n00-003 00-004 00-005 00-006 00-007\nartisan\n..."
                }
                css={css`
                    resize: None;
                    width: 500px;
                    height: 230px;
                `}
            /> */}
            <VBox height={8} />
            <input
                type="file"
                accept=".txt"
                onChange={async (e) => {
                    if (e.target.files === null) return
                    for (const file of e.target.files) {
                        await request("add_mentorings", {
                            accessToken: userInfo.accessToken,
                            semester,
                            mentoringListString: await file.text()
                        })
                    }
                    forceUpdate()
                }}
            />
            <VBox height={8} />
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse; table-layout: fixed;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>#</TableElement.Head>
                        <TableElement.Head>이름</TableElement.Head>
                        <TableElement.Head>멘토</TableElement.Head>
                        <TableElement.Head>멘티</TableElement.Head>
                        <TableElement.Head>삭제</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    {mentorings.sort((a, b) => a.code - b.code).map((men, i) =>
                        <TableElement.Row key={i}>
                            <TableElement.Data>{men.code}</TableElement.Data>
                            <TableElement.Data>
                                <CenterBox>
                                    <MentoringLink name={men.name} code={men.code} />
                                </CenterBox>
                            </TableElement.Data>
                            <TableElement.Data>
                                <GridBox column={1}>
                                    {men.mentors.map((user, i) =>
                                        <CenterBox key={i}>
                                            <ProfileLink name={user.name} id={user.id} />
                                        </CenterBox>)}
                                </GridBox>
                            </TableElement.Data>
                            <TableElement.Data>
                                <GridBox
                                    column={3}
                                    gap={2}
                                    css={css`margin: 0 auto;`}
                                >
                                    {men.mentees.map((user, i) =>
                                        <CenterBox key={i}>
                                            <ProfileLink name={user.name} id={user.id} />
                                        </CenterBox>
                                    )}
                                </GridBox>
                            </TableElement.Data>
                            <TableElement.Data>
                                <Button onClick={async () => {
                                    await request("delete_mentoring", {
                                        accessToken: userInfo.accessToken,
                                        code: men.code,
                                        semester
                                    })
                                    forceUpdate()
                                }}
                                >
                                    삭제
                                </Button>
                            </TableElement.Data>
                        </TableElement.Row>
                    )}
                </tbody>
            </table>
            <VBox height={32} />
        </Fragment>
    )
}