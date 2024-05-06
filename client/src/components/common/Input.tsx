import { css } from "@emotion/react"
import { InputProps } from "../../global"

export const Input: React.FC<InputProps> = (props) => {
    return ( 
        <input
            css={css`
                color: black;
                padding: 12px 8px;
                border: 1px solid var(--nav-border);
                border-radius: 8px;
                width: 100%;
            `}
            {...props}
        />
    )
}