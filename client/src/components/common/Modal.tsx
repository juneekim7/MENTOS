import { css } from "@emotion/react"
import { useEvent } from "../../utils/event"
import { useState } from "react"
import { CenterBox } from "./CenterBox"

export const ModalContainer: React.FC = () => {
    const [ content, setContent ] = useState<React.ReactNode | null>(null)

    useEvent("modal", (content: React.ReactNode | null) => {
        setContent(content)
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
                height: 100%;
                z-index: 100;
            `}
        >
            {content}
        </CenterBox>
    )
}