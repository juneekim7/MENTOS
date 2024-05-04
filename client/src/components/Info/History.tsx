import { css } from "@emotion/react"
import { VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import React from "react"
import { VBox } from "../common/VBox"
import { Log } from "../../../../models/mentoring"
import { intervalFormat } from "../../utils/time"

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

const setTableData = (logs: Log[]) => {
    const tableData = []
    let accTime = 0
    for (const log of logs) {
        const sDate = new Date(log.start)
        const eDate = new Date(log.end)
        const interval = intervalFormat(sDate, eDate)
        accTime += (eDate.getTime() - sDate.getTime()) / 60000
        const hour = Math.floor(accTime / 60)
        const minute = Math.floor(accTime - 60 * hour)
        tableData.push([interval, `${hour}h ${minute}m`])
    }
    return tableData
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
                    {setTableData(props.logs).map(([interval, accTime], i) => (
                        <TableElement.Row key={i}>
                            <TableElement.Data>{i + 1}</TableElement.Data>
                            <TableElement.Data>{interval}</TableElement.Data>
                            <TableElement.Data>{accTime}</TableElement.Data>
                        </TableElement.Row>
                    ))}
                </tbody>
            </table>
        </VFlexBox>
    )
}