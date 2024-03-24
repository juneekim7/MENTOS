import { css } from '@emotion/react'
import { DivProps } from '../../global'
import { omit } from '../../utils/omit'
import { useNavigate } from 'react-router-dom'

interface LinkClickProps {
    path: string
    hover?: string
}

export const LinkClick: React.FC<DivProps<LinkClickProps>> = (props) => {
    const navigate = useNavigate()
    return (
        <div
            {...omit(props, 'children')}
            onClick={() => navigate(props.path)}
            css={css`
                cursor: pointer;
                
                :hover {
                    ${props.hover ?? ''}
                }
            `}
        >
            {props.children}
        </div>
    )
}