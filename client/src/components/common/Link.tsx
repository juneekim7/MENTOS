import { css } from "@emotion/react"
import { TextBox } from "./TextBox"
import { HFlexBox } from "./FlexBox"
import { useNavigate } from "react-router-dom"

interface MentoringLinkProps {
    name: string
    code: number
    addComma?: boolean
    underline?: boolean
}

export const MentoringLink: React.FC<MentoringLinkProps> = (props) => {
    const navigate = useNavigate()

    return (
        <HFlexBox
            onClick={(e) => {
                e.stopPropagation()
                navigate(`/info/${props.code}`)
            }}
            css={css`
                cursor: pointer;
                margin-right: 2px;
                font-variant-numeric: normal;
            `}
        >
            <TextBox size={12} css={css`line-height: 16px;`}>
                {props.code}
            </TextBox>
            <TextBox
                css={css`
                    line-height: 1.2;
                `}
            >
                {props.name}
            </TextBox>
            {props.addComma &&
                <TextBox css={css`line-height: 1.2;`}>
                    ,
                </TextBox>}
        </HFlexBox>
    )
}

interface ProfileLinkProps {
    name: string
    id: string
    showId?: boolean
    addComma?: boolean
    underline?: boolean
}

export const ProfileLink: React.FC<ProfileLinkProps> = (props) => {
    const navigate = useNavigate()

    return (
        <HFlexBox
            onClick={(e) => {
                e.stopPropagation()
                navigate(`/profile/${props.id}`)
            }}
            css={css`
                cursor: pointer;
                margin-right: 2px;
            `}
        >
            {props.showId && <TextBox size={12} css={css`line-height: 16px;`}>
                {props.id}
            </TextBox>}
            <TextBox
                css={css`
                    line-height: 1.2;
                    ${props.underline && `text-decoration: underline;
                    text-underline-offset: 2px;
                    text-decoration-thickness: from-font;`}
                `}
            >
                {props.name}
            </TextBox>
            {props.addComma &&
                <TextBox css={css`line-height: 1.2;`}>
                    ,
                </TextBox>}
        </HFlexBox>
    )
}