import {Avatar, Button, Divider, Popover, Space} from "antd";
import {EditOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import useAuthStore from "@/store/useAuthStore.js";

export default ({
    onLogout,
    onEditPassword,
    children
}) => {
    const userInfo = useAuthStore().userInfo
    return(
        <Popover
            // className="ant-popover_p-0"
            overlayClassName="ant-popover_p-0"
            content={
                <div className={'avatar-content'}>
                    {/* 主题头像 */}
                    <div className={'avatar-bg'}>
                        <div className={'avatar-img'}>
                            <Avatar
                                size={64}
                                src={userInfo?.gender === '男' ? '/images/dor-man.png' : '/images/dor-weman.png'}
                                icon={<UserOutlined/>}>
                            </Avatar>
                        </div>
                        <div className={'avatar-info'}>
                            <div className={'info-usename'}>
                                {userInfo?.userName}
                            </div>
                            <div className={'info-rolename'}>
                                {userInfo?.role === 'admin'? '管理员':'普通用户'}
                            </div>
                        </div>
                    </div>
                    <Divider style={{margin: '15px 0'}}/>
                    {/* 功能按钮 */}
                    {/*<div className={'avatar-btn'}>*/}
                        <Space direction="vertical" size="small" style={{display: 'flex'}}>
                            <Button icon={<EditOutlined />} type={'primary'} onClick={onEditPassword} block>修改密码</Button>
                            <Button icon={<LogoutOutlined/>} onClick={onLogout} block>退出登录</Button>
                        </Space>
                    {/*</div>*/}
                </div>
            }
            trigger={'click'}>
            <Avatar src={userInfo?.gender === '男' ? '/images/dor-man.png' : '/images/dor-weman.png'}></Avatar>
        </Popover>
    )
}