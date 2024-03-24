import { css } from '@emotion/react'

export const VBox: React.FC<{ height: number, bg?: string }> = (props) => {
    return (
        <div css={css`width: 100%; height: ${props.height}px; background-color: ${props.bg ?? 'transparent'};`} />
    )
}