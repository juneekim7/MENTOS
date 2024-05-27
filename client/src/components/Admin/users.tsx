import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { TextBox } from "../common/TextBox"
import { VBox } from "../common/VBox"
import { ProfileLink } from "../common/Link"
import { css } from "@emotion/react"
import { CenterBox } from "../common/CenterBox"
import { UserInfoContext } from "../context/User"
import { request } from "../../utils/connection"
import { User } from "../../../../models/user"

namespace TableElement {
    export const Row: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <tr css={css`border-bottom: 1px solid var(--nav-border);`}>
                {props.children}
            </tr>
        )
    }

    export const Head: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <th
                css={css`
                    font-weight: 700;
                    text-align: center;
                    padding: 8px;
                `}
            >
                {props.children}
            </th>
        )
    }

    export const Data: React.FC<React.PropsWithChildren> = (props) => {
        return (
            <td
                css={css`
                    text-align: center;
                    padding: 8px;
                    line-height: 24px;
                    font-variant-numeric: tabular-nums;
                `}
            >
                {props.children}
            </td>
        )
    }
}

export const AdminUsers: React.FC = () => {
    const { userInfo } = useContext(UserInfoContext)
    const [users, setUsers] = useState<User[]>([])
    const [_r, rerender] = useState({})
    const forceUpdate = useCallback(() => rerender({}), [])
    useEffect(() => {
        (async () => {
            const res = await request("user_list", {
                accessToken: userInfo.accessToken
            })

            if (!res.success) return
            setUsers(res.data)
        })()
    }, [userInfo])
    return (
        <Fragment>
            <TextBox weight={700} size={24}>
                User
            </TextBox>
            <VBox height={8} />
            유저 추가하기:
            <VBox height={8} />
            파일 예시:
            <textarea
                readOnly={true}
                placeholder={"23-031 김준이\n23-046 문가온\n..."}
                css={css`
                    resize: None;
                    height: 70px;
                `}
            />
            <VBox height={8} />
            <input
                type="file"
                accept=".txt"
                onChange={async (e) => {
                    if (e.target.files === null) return
                    for (const file of e.target.files) {
                        await request("add_users", {
                            accessToken: userInfo.accessToken,
                            userListString: await file.text()
                        })
                    }
                    forceUpdate()
                }}
            />
            <VBox height={16} />
            <table css={css`width: 100%; border-collapse: collapse;`}>
                <thead>
                    <TableElement.Row>
                        <TableElement.Head>학번</TableElement.Head>
                        <TableElement.Head>이름</TableElement.Head>
                        <TableElement.Head>삭제</TableElement.Head>
                    </TableElement.Row>
                </thead>
                <tbody>
                    {users.map((user) =>
                        <TableElement.Row>
                            <TableElement.Data>{user.id}</TableElement.Data>
                            <TableElement.Data>
                                <CenterBox>
                                    <ProfileLink id={user.id} name={user.name} />
                                </CenterBox>
                            </TableElement.Data>
                            <TableElement.Data>
                                <button onClick={async () => {
                                    await request("delete_user", {
                                        accessToken: userInfo.accessToken,
                                        id: user.id
                                    })
                                    forceUpdate()
                                }}
                                >삭제</button>
                            </TableElement.Data>
                        </TableElement.Row>
                    )}
                </tbody>
            </table>
        </Fragment >
    )
}