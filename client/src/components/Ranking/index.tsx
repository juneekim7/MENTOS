import { css } from "@emotion/react"
import { Content } from "../common/Content"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { DivisonSelector } from "./DivisionSelector"

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
                    <TableElement.Row>
                        <TableElement.Data>1</TableElement.Data>
                        <TableElement.Data>정보과학1</TableElement.Data>
                        <TableElement.Data>03h 00m</TableElement.Data>
                    </TableElement.Row>
                    <TableElement.Row>
                        <TableElement.Data>2</TableElement.Data>
                        <TableElement.Data>웹 개발</TableElement.Data>
                        <TableElement.Data>06h 00m</TableElement.Data>
                    </TableElement.Row>
                </tbody>
            </table>
        </Content>
    )
}