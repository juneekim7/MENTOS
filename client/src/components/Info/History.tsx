import { css } from "@emotion/react"
import { VFlexBox } from "../common/FlexBox"
import { TextBox } from "../common/TextBox"
import React, { useContext, useEffect, useState } from "react"
import { VBox } from "../common/VBox"
import { Log } from "../../../../models/mentoring"
import { intervalFormat } from "../../utils/time"
import { EventHandler } from "../../utils/event"
import { CenterBox } from "../common/CenterBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { User } from "../../../../models/user"

namespace TableElement {
    export const Row: React.FC<React.ComponentProps<"tr">> = (props) => {
        return (
            <tr
                css={css`
                    border-bottom: 1px solid var(--nav-border);
                    cursor: pointer;
                `}
                {...props}
            >
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

interface LogModalContentProps {
    startImageId: string
    endImageId: string
    time: string
}

const LogModalContent: React.FC<LogModalContentProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [ image, setImage ] = useState(["", ""])

    useEffect(() => {
        (async () => {
            const res = await request("log_image", {
                accessToken: userInfo.accessToken,
                startImageId: props.startImageId,
                endImageId: props.endImageId
            })

            if (!res.success) return
            setImage([ res.data.startImage, res.data.endImage ])
        })() 
    }, [props, userInfo])

    return (
        <div
            css={css`
                background-color: white;
                padding: 16px;
                border-radius: 8px;
                
                box-sizing: border-box;
                width: 90vw;
                max-width: 500px;
                position: relative;
            `}
            onClick={(e) => e.stopPropagation()}
        >
            <TextBox weight={600} size={24} center>
                멘토링 기록
            </TextBox>
            <VBox height={4} />
            <TextBox center color="gray">
                일시 : {props.time}
            </TextBox>
            <CenterBox
                css={css`
                    position: absolute;
                    right: 12px;
                    top: 12px;
                    width: 30px;
                    height: 30px;
                    box-sizing: border-box;
                    border-radius: 6px;
                    cursor: pointer;

                    :hover {
                        background-color: var(--nav-hover);
                    }
                `}
                onClick={() => EventHandler.trigger("modal", null)}
            >
                <FontAwesomeIcon
                    icon={faXmark}
                    size="xl"
                    color="#808080"
                />
            </CenterBox>
            <VBox height={32} />
            <TextBox weight={600} size={20}>
                시작 사진
            </TextBox>
            <CenterBox
                css={css`
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    overflow: hidden;
                `}
            >
                <img
                    src={image[0]}
                    css={css`
                        width: 100%;
                        object-fit: scale-down;
                    `}
                />
            </CenterBox><VBox height={32} />
            <TextBox weight={600} size={20}>
                종료 사진
            </TextBox>
            <CenterBox
                css={css`
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    overflow: hidden;
                `}
            >
                <img
                    src={image[1]}
                    css={css`
                        width: 100%;
                        object-fit: scale-down;
                    `}
                />
            </CenterBox>
        </div>
    )
}

interface HistoryProps {
    logs: Log[]
    mentors: User[]
}

export const History: React.FC<HistoryProps> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    
    return (
        <VFlexBox full>
            <TextBox size={24} weight={700}>
                멘토링 내역
            </TextBox>
            <VBox height={16    } />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    {props.logs.length === 0 
                        ? <TableElement.Row />
                        : <TableElement.Row>
                            <TableElement.Head>#</TableElement.Head>
                            <TableElement.Head>일시</TableElement.Head>
                            <TableElement.Head>누적 시간</TableElement.Head>
                        </TableElement.Row>}
                </thead>
                <tbody>
                    {props.logs.length === 0
                        ? <TableElement.Row>
                            <TableElement.Data>
                                <TextBox
                                    weight={500}
                                    size={18}
                                    css={css`line-height: 24px;`}
                                    color="#808080"
                                    center
                                >
                                    멘토링 내역이 없습니다.
                                </TextBox>
                            </TableElement.Data>    
                        </TableElement.Row>
                        : setTableData(props.logs).map(([interval, accTime], i) =>
                            <TableElement.Row
                                key={i}
                                onClick={() => {
                                    if (userInfo.isAdmin || props.mentors.some((mtr) => mtr.id === userInfo.id))
                                        EventHandler.trigger("modal",
                                            <LogModalContent
                                                startImageId={props.logs[i].startImageId}
                                                endImageId={props.logs[i].endImageId}
                                                time={interval}
                                            />)
                                }}
                            >
                                <TableElement.Data>{i + 1}</TableElement.Data>
                                <TableElement.Data>{interval}</TableElement.Data>
                                <TableElement.Data>{accTime}</TableElement.Data>
                            </TableElement.Row>)}
                </tbody>
            </table>
        </VFlexBox>
    )
}