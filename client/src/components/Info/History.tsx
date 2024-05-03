import { css } from "@emotion/react"
import { VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import React from "react"
import { VBox } from "../common/VBox"
import { Log } from "../../../../models/mentoring"

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

interface IHistoryProps {
    logs: Log[]
}

export const History: React.FC<IHistoryProps> = (props) => {
    return (
        <VFlexBox full>
            <TextBox size={24} weight={700}>
                멘토링 내역
            </TextBox>
            <VBox height={8} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>#</TableElement.Head>
                        <TableElement.Head>일시</TableElement.Head>
                        <TableElement.Head>누적 시간</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    {props.logs.map((log, i) => (
                        <TableElement.Row>
                            <TableElement.Data>{i + 1}</TableElement.Data>
                            <TableElement.Data>{log.start.toString()}</TableElement.Data>
                            <TableElement.Data></TableElement.Data>
                        </TableElement.Row>
                    ))}
                </tbody>
            </table>
        </VFlexBox>
    )
}