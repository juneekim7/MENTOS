import { LinkClick } from "../common/LinkClick"
import { HeaderElement } from "./Element"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrophy } from "@fortawesome/free-solid-svg-icons"
import { Login } from "./Login"

export const Header: React.FC = () => {
    return (
        <HeaderElement.Container>
            <HeaderElement.Content>
                <HeaderElement.LinkContainer>
                    <LinkClick path="/">
                        <HeaderElement.Logo />
                    </LinkClick>
                    <HeaderElement.Link path="/ranking">
                        <FontAwesomeIcon icon={faTrophy} style={{ color: "var(--nav-text)" }} />
                    </HeaderElement.Link>
                </HeaderElement.LinkContainer>
                <Login />
            </HeaderElement.Content>
        </HeaderElement.Container>
    )
}