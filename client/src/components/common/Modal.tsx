import { css } from "@emotion/react"
import { EventHandler, useEvent } from "../../utils/event"
import { useState } from "react"
import { CenterBox } from "./CenterBox"

export const ModalContainer: React.FC = () => {
    const [content, setContent] = useState<React.ReactNode | null>(null)

    useEvent("modal", (content: React.ReactNode | null) => {
        setContent(content)
        if (content === null) document.body.style.overflow = "auto"
        else document.body.style.overflow = "hidden"
    })

    if (content === null) return <></>

    return (
        <CenterBox
            css={css`
                position: fixed;
                top: 0;
                left: 0;
                background-color: #00000088;
                width: 100%;
                height: 100dvh;
                z-index: 100;
            `}
            onClick={() => EventHandler.trigger("modal", null)}
        >
            {content}
        </CenterBox>
    )
}