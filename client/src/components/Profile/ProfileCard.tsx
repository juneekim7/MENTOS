import { css } from "@emotion/react"
import { VFlexBox } from "../common/FlexBox"
import { CenterBox } from "../common/CenterBox"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { useContext, useEffect, useState } from "react"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"

export const ProfileCard: React.FC<{ id: string }> = (props) => {
    const { id } = props
    const { userInfo } = useContext(UserInfoContext)
    const [name, setName] = useState("")
    const imageSrc = `https://ksain.net/files/stuPhoto/${id}.jpg`
    
    useEffect(() => {
        (async () => {
            const res = await request("get_user_name", {
                accessToken: userInfo.accessToken,
                id
            })

            if (!res.success) return
            setName(res.data)
        })()
    }, [id, userInfo])

    return (
        <div>
            <CenterBox
                css={css`
                    width: 40%;
                    aspect-ratio: 1;
                    border-radius: 100vw;
                    overflow: hidden;
                    border: 3px solid #C2C3C4;
                    margin: 0 auto;
                    max-width: 200px;
                `}
            >
                <img src={imageSrc} alt="프로필 사진" css={css`width: 100%;`} />
            </CenterBox>
            <VBox height={16} />
            <VFlexBox center css={css`width: fit-content; margin: 0 auto;`}>
                <TextBox weight={600} size={24}>
                    {name}
                </TextBox>
                <VBox height={4} />
                <TextBox color="gray">
                    {id}
                </TextBox>
            </VFlexBox>
        </div>
    )
}