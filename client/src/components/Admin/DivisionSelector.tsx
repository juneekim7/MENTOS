import { css } from "@emotion/react"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import { Show } from "."

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

interface AdminDivisonSelectorProps {
    division: Show
    setDivision: React.Dispatch<React.SetStateAction<Show>>
}

export const AdminDivisonSelector: React.FC<AdminDivisonSelectorProps> = (props) => {
    return (
        <div>
            <Division
                selected={props.division === "users"}
                onClick={() => props.setDivision("users")}
            >
                유저
            </Division>
            <Division
                selected={props.division === "mentorings"}
                onClick={() => props.setDivision("mentorings")}
            >
                멘토링
            </Division>
        </div>
    )
}