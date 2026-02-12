import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import './index.scss';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {SystemLogin} from "@/api/system/home/index.js";
import useAuthStore from "@/store/useAuthStore.js";


export default () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        autoLogin: false,
    });
    const [loading, setLoading] =useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const userLogin = useAuthStore().login;
    // 登录按钮
    const loginSubmit = () => {
        setLoading(true)
        const cancelLogin = () => {
            setLoading(false)
        }
        SystemLogin(formData).then(res => {
            message.success('登录成功')
            userLogin({token:res.data.token, userInfo:res.data, role:res.data.role}, navigate)
            if (formData.autoLogin) {
                // 记录登录用户名和密码
                // 后续自动填充
                localStorage.setItem("userName", formData.userName);
                localStorage.setItem("password", formData.password);
                localStorage.setItem("autoLogin", formData.autoLogin);
            }
        }).finally(cancelLogin)
    }
    // 自动登录
    useEffect(() => {
        if (localStorage.getItem('autoLogin')) {
            SystemLogin({
                userName: localStorage.getItem('userName'),
                password: localStorage.getItem('password'),
            }).then(res => {
                message.success('登录成功')
                userLogin({token:res.data.token, userInfo:res.data, role:res.data.role}, navigate)
            })
        }
    }, []);

    return (
        <div className={'login-container'}>
            {/* 登录背景 */}
            <div className={'login-bg'}>
                {/* 登录背景图片 */}
                <div className={'login-st'}>
                    <div className={'welcome-text'}>
                        WELCOME TO PSSYSTEM
                    </div>
                </div>
                {/* 登录表单 */}
                <div className={'login-form'}>
                    {/* 登录logo */}
                    <div className={'login-logo'} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <div className={'logo-title'}>
                            随访管理系统
                        </div>
                    </div>
                    {/* 输入框 */}
                    <div className={'login-text'}>
                        <Form>
                            <Form.Item>
                                <Input
                                    placeholder='请输入用户名'
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item>
                                <Input.Password
                                    placeholder='请输入密码'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    prefix={<LockOutlined />} />
                            </Form.Item>
                        </Form>
                    </div>
                    {/* 操作按钮 */}
                    <div className={'login-operate'}>
                        <div className={'remember'}>
                            <Checkbox
                                checked={formData.autoLogin}
                                onChange={
                                    (e) =>
                                        setFormData({
                                            ...formData,
                                            autoLogin: e.target.checked
                                        })
                                }>
                                自动登录
                            </Checkbox>
                        </div>
                        <div className={'btn-log'}>
                            <Button
                                loading={loading}
                                onClick={loginSubmit}
                                type='primary'
                                style={{width:'100%'}}>
                                登录
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};