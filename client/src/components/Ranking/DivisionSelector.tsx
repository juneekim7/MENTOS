import { css } from "@emotion/react"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import { TDivision } from "."

interface DivisionProps {
    selected: boolean
}

const Division: React.FC<DivProps<DivisionProps>> = (props) => {
    return (
        <div
            css={css`
                padding: 16px;
                transition: background-color 0.5s;
                display: inline-block;
                cursor: pointer;
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

interface DivisonSelectorProps {
    division: TDivision
    setDivision: React.Dispatch<React.SetStateAction<TDivision>>
}

export const DivisonSelector: React.FC<DivisonSelectorProps> = (props) => {
    return (
        <div>
            <Division
                selected={props.division === "mentor"}
                onClick={() => props.setDivision("mentor")}
            >
                멘토
            </Division>
            <Division
                selected={props.division === "mentee"}
                onClick={() => props.setDivision("mentee")}
            >
                멘티
            </Division>
        </div>
    )
}