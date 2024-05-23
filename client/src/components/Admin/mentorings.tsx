import { Fragment, useContext, useEffect, useState } from "react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { css } from "@emotion/react"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { Mentoring, Semester } from "../../../../models/mentoring"
import { MentoringLink, ProfileLink } from "../common/Link"
import { CenterBox } from "../common/CenterBox"
import { GridBox } from "../common/GridBox"

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
    useEffect(() => {
        (async () => {
            const res = await request("mentoring_list", {
                accessToken: userInfo.accessToken,
                semester
            })

            if (!res.success) return
            setMentorings(res.data)
        })()
    }, [semester, userInfo])
    return (
        <Fragment>
            <TextBox weight={700} size={24}>
                Mentorings {semester}
            </TextBox>
            <VBox height={8} />
            학기:
            <input
                placeholder="학기 입력(20XX-1)"
                defaultValue={props.defaultSemester}
                onChange={(e) => {
                    if (/20\d\d-[12]/.test(e.target.value)) setSemester(e.target.value as Semester)
                }}
            />
            <VBox height={8} />
            멘토링 추가하기:
            <VBox height={8} />
            파일 예시:
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
            />
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
                    alert("추가되었습니다. 새로고침 하세요.")
                }}
            />
            <VBox height={8} />
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>코드</TableElement.Head>
                        <TableElement.Head>이름</TableElement.Head>
                        <TableElement.Head>멘토</TableElement.Head>
                        <TableElement.Head>멘티</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    {mentorings.map((men) =>
                        <TableElement.Row>
                            <TableElement.Data>{men.code}</TableElement.Data>
                            <TableElement.Data>
                                <CenterBox><MentoringLink name={men.name} code={men.code} /></CenterBox>
                                <button onClick={async () => {
                                    await request("delete_mentoring", {
                                        accessToken: userInfo.accessToken,
                                        semester,
                                        code: men.code
                                    })
                                    alert("삭제되었습니다. 새로고침 하세요.")
                                }}
                                >삭제</button>
                            </TableElement.Data>
                            <TableElement.Data>
                                <GridBox column={1}>
                                    {men.mentors.map(
                                        (user) => <CenterBox>
                                            <ProfileLink name={user.name + " "} id={user.id} />
                                        </CenterBox>
                                    )}
                                </GridBox>
                            </TableElement.Data>
                            <TableElement.Data>
                                <GridBox column={3} gap={2}>
                                    {men.mentees.map(
                                        (user) => <CenterBox>
                                            <ProfileLink name={user.name + " "} id={user.id} />
                                        </CenterBox>
                                    )}
                                </GridBox>
                            </TableElement.Data>

                        </TableElement.Row>
                    )}
                </tbody>
            </table>
        </Fragment >
    )
}