import { css } from "@emotion/react"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import { useState } from "react"

type TDivision = "mentor" | "mentee"

interface IDivision {
    selected: boolean
}

const Division: React.FC<DivProps<IDivision>> = (props) => {
    return (
        <div
            css={css`
                padding: 16px;
                transition: background-color 0.5s;
                display: inline-block;
                ${props.selected && `
                    border-bottom: 2px solid black;
                    font-weight: 700;
                `}

                :hover {
                    background-color: var(--nav-hover);
                    border-bottom: 2px solid black;
                }
            `}
            {...omit(props, "children", "selected")}
        >
            {props.children}
        </div>
    )
}

export const DivisonSelector: React.FC = () => {
    const [division, setDivision] = useState<TDivision>("mentor")

    return (
        <div>
            <Division
                selected={division === "mentor"}
                onClick={() => setDivision("mentor")}
            >
                멘토
            </Division>
            <Division
                selected={division === "mentee"}
                onClick={() => setDivision("mentee")}
            >
                멘티
            </Division>
        </div>
    )
}