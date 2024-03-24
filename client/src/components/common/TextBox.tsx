import { css } from '@emotion/react'
import { DivProps } from '../../global'
import { omit } from '../../utils/omit'

interface TextBoxProps {
    size?: number
    weight?: number
    color?: string
    center?: boolean
    inline?: boolean
    family?: string
    break?: boolean
}

export const TextBox: React.FC<DivProps<TextBoxProps>> = (props) => {
    return (
        <div
            {...omit(props, 'children', 'size', 'weight', 'color', 'center', 'inline', 'family', 'break')}
            css={css`
                font-family: ${props.family ?? 'inherit'};
                color: ${props.color ?? 'var(--default-text)'};
                font-size: ${props.size ?? 16}px;
                font-weight: ${props.weight ?? 400};
                text-align: ${props.center ? 'center' : 'left'};
                display: ${props.inline ? 'inline' : 'block'};
                word-break: ${props.break ? 'break-word' : 'normal'}
            `}
        >
            {props.children}
        </div>
    )
}