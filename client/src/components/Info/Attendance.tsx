import { css } from "@emotion/react"
import { HFlexBox, VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import React from "react"
import { VBox } from "../common/VBox"
import { User } from "../../../../models/user"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"

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

interface IAttendanceProps {
    queue: User[]
}

export const Attendance: React.FC<IAttendanceProps> = (props) => {
    return (
        <VFlexBox full>
            <TextBox size={24} weight={700}>
                출석체크
            </TextBox>
            <VBox height={8} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <tbody>
                    {props.queue.map((user, i) => (
                        <TableElement.Row key={i}>
                            <TableElement.Data>{user.id}</TableElement.Data>
                            <TableElement.Data>{user.name}</TableElement.Data>
                            <TableElement.Data>
                                <HFlexBox gap={8}>
                                    <FontAwesomeIcon icon={faCheck} style={{ color: "#24CB01" }} />
                                    <FontAwesomeIcon icon={faXmark} style={{ color: "#FE0000" }} />
                                </HFlexBox>
                            </TableElement.Data>
                        </TableElement.Row>
                    ))}
                </tbody>
            </table>
        </VFlexBox>
    )
}