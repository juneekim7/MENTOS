import { css } from "@emotion/react"
import { VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import React from "react"
import { VBox } from "../common/VBox"
import { User } from "../../../../models/user"

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

interface AttendedProps {
    attend: User[],
    code: number,
    forceUpdate: () => void
}

export const Attended: React.FC<AttendedProps> = (props) => {
    return (
        <VFlexBox full>
            <TextBox size={24} weight={700}>
                출석 명단
            </TextBox>
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row />
                </thead>
                <tbody>
                    {props.attend.length === 0
                        ? <TableElement.Row>
                            <TableElement.Data>
                                <TextBox
                                    weight={500}
                                    size={18}
                                    css={css`line-height: 24px;`}
                                    color="#808080"
                                    center
                                >
                                    출석한 멘티가 없습니다.
                                </TextBox>
                            </TableElement.Data>    
                        </TableElement.Row>
                        : props.attend.map((user, i) => (
                            <TableElement.Row key={i}>
                                <TableElement.Data css={css`width: 60%;`}>
                                    {user.id} {user.name}
                                </TableElement.Data>
                            </TableElement.Row>
                        ))}
                </tbody>
            </table>
        </VFlexBox>
    )
}