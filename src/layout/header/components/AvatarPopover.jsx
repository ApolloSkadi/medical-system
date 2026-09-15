import {Avatar, Button, Divider, Popover, Space} from "antd";
import {EditOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import useAuthStore from "@/store/useAuthStore.js";

const ROLE_LABEL = {
    admin: '管理员',
    user: '普通用户',
    platform: '平台管理员',
}

export default ({
    onLogout,
    onEditPassword,
    children
}) => {
    const userInfo = useAuthStore().userInfo
    const roleLabel = ROLE_LABEL[userInfo?.role] ?? '普通用户'
    const avatarSrc = userInfo?.gender === '男' ? '/images/dor-man.png' : '/images/dor-weman.png'
    return(
        <Popover
            classNames={{root: 'user-popover'}}
            placement={'bottomRight'}
            trigger={'click'}
            content={
                <div className={'avatar-content'}>
                    {/* 主题头像 */}
                    <div className={'avatar-bg'}>
                        <div className={'avatar-img'}>
                            <Avatar
                                size={64}
                                src={avatarSrc}
                                icon={<UserOutlined/>}>
                            </Avatar>
                        </div>
                        <div className={'avatar-info'}>
                            <div className={'info-usename'}>
                                {userInfo?.userName}
                            </div>
                            <div className={'info-rolename'}>
                                {roleLabel}
                            </div>
                        </div>
                    </div>
                    <Divider style={{margin: '14px 0'}}/>
                    {/* 功能按钮 */}
                    <Space direction="vertical" size="small" style={{display: 'flex'}}>
                        <Button icon={<EditOutlined />} type={'primary'} onClick={onEditPassword} block>修改密码</Button>
                        <Button icon={<LogoutOutlined/>} onClick={onLogout} block>退出登录</Button>
                    </Space>
                </div>
            }
        >
            {/* 右上角头像: 保持系统默认样式, 不加额外样式 */}
            <Avatar src={avatarSrc} icon={<UserOutlined/>}/>
        </Popover>
    )
}
