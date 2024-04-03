import { css } from "@emotion/react"
import { CSSTransition } from "react-transition-group"
import { useEffect, useState } from "react"
import { useEvent } from "../../utils/event"

import Check from "@assets/check.svg"
import Forbidden from "@assets/forbidden.svg"

type NotiType = "allowed" | "forbidden"
interface INotificationInfo {
    type: NotiType
    content: string | undefined
}

export const Notification: React.FC<INotificationInfo> = (props) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setTimeout(() => {
            setMounted(false)
        }, 3000)
    }, [])

    return (    
        <CSSTransition in={mounted} timeout={400} mountOnEnter unmountOnExit classNames="notification">
            <div
                css={css`
                    padding: 8px;
                    border-radius: 8px;
                    background-color: #ffffff;
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;
                    box-shadow: #dadfe366 0px 4px 8px;
                    white-space: nowrap;
                    position: relative;

                    @keyframes open {
                        from {
                            top: -50px;
                        }
                        to { 
                            top: 0px;
                        }
                    }

                    @keyframes close {
                        0% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 0;
                        }
                    }

                    &.notification-enter-active {
                        animation: open 0.4s ease forwards;
                    }

                    &.notification-exit-active {
                        animation: close 0.4s ease forwards;
                    }
                `}
            >
                <img src={props.type === "allowed" ? Check : Forbidden} height={20} />
                <div>{props.content}</div>
            </div>
        </CSSTransition>
    )
}

export const NotiContainer: React.FC = () => {
    const [contents, setContents] = useState<{ type: NotiType, content: string, key: string }[]>([])

    useEvent("notification", (type: NotiType, content: string) => {
        const key = Date.now().toString()
        setContents([ ...contents, { type, content, key } ])
    })

    return (
        <div
            css={css`
                position: fixed;
                top: 30px;
                left: 50%;
                transform: translate(-50%, 0);
                display: flex;
                flex-direction: column;
                z-index: 100;
                gap: 20px; 
            `}
        >
            {contents.map((props) => <Notification {...props} />)}
        </div>
    )
}