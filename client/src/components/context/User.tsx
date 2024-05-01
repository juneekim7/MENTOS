import { createContext, useState } from "react"
import { type User } from "../../types/user"

interface IUserInfoContext {
    userInfo: User
    setUserInfo: React.Dispatch<React.SetStateAction<User>> | null
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
    const [userInfo, setUserInfo] = useState<User>(defaultInfo)
    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {props.children}
        </UserInfoContext.Provider>
    )
}