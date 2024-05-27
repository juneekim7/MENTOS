import { css } from "@emotion/react"
import { useNavigate } from "react-router-dom"
import { DivProps } from "../../global"
import { omit } from "../../utils/omit"
import LogoImg from "@assets/logo.png"
import { CenterBox } from "../common/CenterBox"

export namespace HeaderElement {
    export const Logo: React.FC = () => {
        return (
            <CenterBox
                css={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 0;
                `}
            >
                <img
                    src={LogoImg}
                    css={css`
                        height: 16px;
                    `}
                />
            </CenterBox>
        )
    }

    export const LinkContainer: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <div
                css={css`
                    display: flex;
                    height: 100%;
                    align-items: center;
                    gap: 5px;
                `}
            >
                {props.children}
            </div>
        )
    }

    export const Hover: React.FC<DivProps> = (props) => {
        return (
            <div
                css={css`
                    border-radius: 6px;
                    padding: 10px 12px;
                    color: var(--nav-text);
                    cursor: pointer;

                    :hover {
                        background-color: var(--nav-hover);
                    }
                `}
                {...omit(props, "children")}
            >
                {props.children}
            </div>
        )
    }

    export const Link: React.FC<React.PropsWithChildren<{ path: string }>> = (props) => {
        const navigate = useNavigate()

        return (
            <Hover onClick={() => navigate(props.path)}>
                {props.children}
            </Hover>
        )
    }

    export const Container: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <div
                css={css`
                    position: fixed;
                    top: 0;
                    width: 100%;
                    height: 60px;
                    border-bottom: 1px solid var(--nav-border);
                    background-color: white;
                    z-index: 50;
                `}
            >
                {props.children}
            </div>
        )
    }

    export const Content: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <div
                css={css`
                    max-width: 1200px;
                    padding: 0 16px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    margin: 0 auto;
                `}
            >
                {props.children}
            </div>
        )
    }
}