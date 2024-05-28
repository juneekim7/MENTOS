import { css } from "@emotion/react"
import { HFlexBox, VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import React, { useContext } from "react"
import { VBox } from "../common/VBox"
import { User } from "../../../../models/user"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { omit } from "../../utils/omit"
import { DivProps } from "../../global"
import { CenterBox } from "../common/CenterBox"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"

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
                `}
            >
                {props.children}
            </th>
        )
    }

    export const Data: React.FC<React.PropsWithChildren & React.ComponentProps<"td">> = (props) => {
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

interface IAttendanceProps {
    queue: User[],
    code: number,
    forceUpdate: () => void
}

const Hover: React.FC<DivProps> = (props) => {
    return (
        <CenterBox
            css={css`
                border-radius: 6px;
                width: 24px;
                height: 24px;
                cursor: pointer;

                :hover {
                    background-color: var(--nav-hover);
                }
            `}
            {...omit(props, "children")}
        >
            {props.children}
        </CenterBox>
    )
}

export const Attendance: React.FC<IAttendanceProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)

    return (
        <VFlexBox full>
            <TextBox size={24} weight={700}>
                출석 요청
            </TextBox>
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row />
                </thead>
                <tbody>
                    {props.queue.length === 0
                        ? <TableElement.Row>
                            <TableElement.Data>
                                <TextBox
                                    weight={500}
                                    size={18}
                                    css={css`line-height: 24px;`}
                                    color="#808080"
                                    center
                                >
                                    출석을 기다리고 있는 멘티가 없습니다.
                                </TextBox>
                            </TableElement.Data>
                        </TableElement.Row>
                        : props.queue.map((user, i) => (
                            <TableElement.Row key={i}>
                                <TableElement.Data css={css`width: 60%;`}>{user.id} {user.name}</TableElement.Data>
                                <TableElement.Data>
                                    <HFlexBox
                                        gap={16}
                                        center
                                        css={css`justify-content: center;`}
                                    >
                                        <Hover
                                            onClick={
                                                async () => {
                                                    const res = await request("mentoring_attend_accept", {
                                                        accessToken: userInfo.accessToken,
                                                        code: props.code,
                                                        menteeId: user.id
                                                    }, true)
                                                    if (res.success) props.forceUpdate()
                                                }
                                            }
                                        >
                                            <FontAwesomeIcon icon={faCheck} style={{ color: "#24CB01" }} />
                                        </Hover>
                                        <Hover
                                            onClick={
                                                async () => {
                                                    const res = await request("mentoring_attend_decline", {
                                                        accessToken: userInfo.accessToken,
                                                        code: props.code,
                                                        menteeId: user.id
                                                    }, true)
                                                    if (res.success) props.forceUpdate()
                                                }
                                            }
                                        >
                                            <FontAwesomeIcon icon={faXmark} style={{ color: "#FE0000" }} />
                                        </Hover>
                                    </HFlexBox>
                                </TableElement.Data>
                            </TableElement.Row>
                        ))}
                </tbody>
            </table>
        </VFlexBox>
    )
}