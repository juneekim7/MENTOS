import { createContext, useState } from "react"
import { type ClientUser } from "../../types/user"

interface IUserInfoContext {
    userInfo: ClientUser
    setUserInfo: React.Dispatch<React.SetStateAction<ClientUser>> | null
}

const defaultInfo = {
    name: "",
    id: "",
    isLoggedIn: false,
    accessToken: ""
}

export const UserInfoContext = createContext<IUserInfoContext>({
    userInfo: defaultInfo,
    setUserInfo: null
})

export const UserProvider: React.FC<React.PropsWithChildren> = (props) => {
    const [userInfo, setUserInfo] = useState<ClientUser>(defaultInfo)

    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {props.children}
        </UserInfoContext.Provider>
    )
}