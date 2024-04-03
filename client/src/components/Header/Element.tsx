import { css } from "@emotion/react"
import { useNavigate } from "react-router-dom"
import { TextBox } from "../common/TextBox"

export namespace HeaderElement {
    export const linkCSS = css`
        border-radius: 6px;
        padding: 10px 12px;
        color: var(--nav-text);
        cursor: pointer;

        :hover {
            background-color: var(--nav-hover);
        }
    `

    export const Logo: React.FC = () => {
        return (
            <div
                css={css`
                    font-family: "Anta", sans-serif;
                    font-weight: 400;
                    font-style: normal;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                `}
            >
                <TextBox color="#B26CD6" inline>M</TextBox>
                <TextBox color="#D6D74E" inline>E</TextBox>
                <TextBox color="#E75DC7" inline>N</TextBox>
                <TextBox color="#E6A345" inline>T</TextBox>
                <TextBox color="#E03E4D" inline>O</TextBox>
                <TextBox color="#01B466" inline>S</TextBox>
            </div>
        )
    }

    export const LinkContainer: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <div
                css={css`
                    display: flex;
                    height: 100%;
                    gap: 5px;
                    align-items: center;
                `}
            >
                {props.children}
            </div>
        )
    }

    export const Link: React.FC<React.PropsWithChildren<{ path: string }>> = (props) => {
        const navigate = useNavigate()

        return (
            <div
                css={linkCSS}
                onClick={() => navigate(props.path)}
            >
                {props.children}
            </div>
        )
    }

    export const Login: React.FC = () => {
        return (
            <div css={css`margin: 0 0 0 auto;`}>
                <div
                    css={linkCSS}
                    onClick={() => { }}
                >
                    Login
                </div>
            </div>
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