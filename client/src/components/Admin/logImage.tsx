import { useContext, useEffect, useState } from "react"
import { Content } from "../common/Content"
import { request } from "../../utils/connection"
import { UserInfoContext } from "../context/User"
import { Semester } from "../../../../models/mentoring"
import { css } from "@emotion/react"

export const LogImage: React.FC<{ semester: Semester, imageId: string }> = (props) => {
    const { userInfo } = useContext(UserInfoContext)
    const [verifyAdmin, setVerifyAdmin] = useState(false)
    const [image, setImage] = useState("")
    useEffect(() => {
        (async () => {
            const verifyAdminRes = await request("verify_admin", {
                accessToken: userInfo.accessToken
            })

            if (!verifyAdminRes.success) return
            setVerifyAdmin(true)

            const logImageRes = await request("log_image", {
                accessToken: userInfo.accessToken,
                semester: props.semester,
                imageId: props.imageId
            })

            if (!logImageRes.success) return
            setImage(logImageRes.data)
        })()
    }, [props.imageId, props.semester, userInfo])
    if (!verifyAdmin) {
        return <>You are not admin!</>
    }
    return (
        <Content>
            <img src={image} css={css`width: 400px; height: 400px;`} />
        </Content>
    )
}