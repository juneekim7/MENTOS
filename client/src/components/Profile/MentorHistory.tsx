import { Fragment } from "react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { MentoringLink } from "../common/Link"
import { HFlexBox } from "../common/FlexBox"
import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons"

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

export const MentorHistory: React.FC = () => {
    return (
        <Fragment>
            <TextBox weight={700} size={24}>
                멘토 활동 내역
            </TextBox>
            <VBox height={8} />
            <HFlexBox center>
                <TextBox weight={500}>활동 멘토링 : </TextBox>
                <TextBox>
                    <MentoringLink name="시그마 정멘" code={10} />
                </TextBox>
            </HFlexBox>
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>#</TableElement.Head>
                        <TableElement.Head>멘토링</TableElement.Head>
                        <TableElement.Head>일시</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    <TableElement.Row>
                        <TableElement.Data>1</TableElement.Data>
                        <TableElement.Data>
                            <CenterBox>
                                <MentoringLink name="웹 개발" code={25} />
                            </CenterBox>
                        </TableElement.Data>
                        <TableElement.Data>2024.05.23.</TableElement.Data>
                    </TableElement.Row>
                </tbody>
            </table>
            <VBox height={16} />
            <HFlexBox center gap={8} css={css`justify-content: center;`}>
                <FontAwesomeIcon
                    icon={faCaretLeft}
                    css={css`
                        color: var(--mentos-official);
                        cursor: pointer;
                    `}
                    size="xl"
                />
                <TextBox weight={500} size={18}>2024-1</TextBox>
                <FontAwesomeIcon
                    icon={faCaretRight}
                    css={css`
                        color: var(--mentos-official);
                        cursor: pointer;
                    `}
                    size="xl"
                />
            </HFlexBox>
        </Fragment>
    )
}