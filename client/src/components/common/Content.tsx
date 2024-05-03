import { css } from "@emotion/react"

export const Content: React.FC<React.PropsWithChildren> = (props) => {
    return (
        <div
            css={css`
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 16px;
            `}
        >
            {props.children}
        </div>
    )
}