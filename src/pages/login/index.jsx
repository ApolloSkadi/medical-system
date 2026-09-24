import React, {useEffect, useRef, useState} from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import './index.scss';
import {
    CalendarOutlined,
    LockOutlined,
    RadarChartOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {SystemLogin} from "@/api/system/home/index.js";
import useAuthStore from "@/store/useAuthStore.js";

// 左侧品牌区能力点(纯代码图形, 无图片资源)
const FEATURES = [
    {icon: <TeamOutlined/>, title: '研究对象管理', desc: '入组、录入和导出'},
    {icon: <CalendarOutlined/>, title: '随访计划提醒', desc: '访视节点自动排期与状态跟踪'},
    {icon: <RadarChartOutlined/>, title: '检查数据管理', desc: '超声 / CMR / 住院数据等'},
];

export default () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        autoLogin: false,
    });
    const [loading, setLoading] = useState(false);
    const [shaking, setShaking] = useState(false);
    const shakeTimer = useRef(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 登录失败/校验不通过时的一次轻量抖动反馈
    const triggerShake = () => {
        window.clearTimeout(shakeTimer.current);
        setShaking(true);
        shakeTimer.current = window.setTimeout(() => setShaking(false), 620);
    };

    useEffect(() => () => window.clearTimeout(shakeTimer.current), []);

    const userLogin = useAuthStore().login;

    // 登录按钮
    const loginSubmit = () => {
        if (loading) return;
        if (!formData.userName?.trim() || !formData.password) {
            message.warning('请输入用户名和密码');
            triggerShake();
            return;
        }
        setLoading(true)
        SystemLogin(formData).then(res => {
            message.success('登录成功')
            userLogin({token:res.data.token, userInfo:res.data, role:res.data.role, permissions:res.data.permissions ?? []}, navigate)
            if (formData.autoLogin) {
                // 记录登录用户名和密码
                // 后续自动填充
                localStorage.setItem("userName", formData.userName);
                localStorage.setItem("password", formData.password);
                localStorage.setItem("autoLogin", formData.autoLogin);
            }
        }).catch(() => {
            // 错误提示由请求拦截器统一弹出, 这里只补动效反馈
            triggerShake();
        }).finally(() => setLoading(false))
    }

    // 自动登录
    useEffect(() => {
        if (localStorage.getItem('autoLogin')) {
            SystemLogin({
                userName: localStorage.getItem('userName'),
                password: localStorage.getItem('password'),
            }).then(res => {
                message.success('登录成功')
                userLogin({token:res.data.token, userInfo:res.data, role:res.data.role, permissions:res.data.permissions ?? []}, navigate)
            })
        }
    }, []);

    return (
        <div className={'login-page'}>
            {/* 左侧品牌区(小屏自动隐藏) */}
            <aside className={'login-brand'}>
                <div className={'brand-inner'}>
                    <div className={'brand-logo'}>
                        <span className={'brand-mark'}>
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path
                                    pathLength="200"
                                    d="M8 34h11l5-13 8 26 6-18 4 5h14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <div className={'brand-logo-text'}>
                            <div className={'brand-name'}>随访管理系统</div>
                            <div className={'brand-sub'}>SPIRR-PS-PA 临床试验</div>
                        </div>
                    </div>
                    <ul className={'brand-features'}>
                        {FEATURES.map((item, index) => (
                            <li key={item.title} style={{'--i': index}}>
                                <span className={'feature-icon'}>{item.icon}</span>
                                <span className={'feature-text'}>
                                    <span className={'feature-title'}>{item.title}</span>
                                    <span className={'feature-desc'}>{item.desc}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={'brand-foot'}>
                    <SafetyCertificateOutlined/>
                    数据按租户隔离存储 · 仅授权人员可访问
                </div>
            </aside>

            {/* 右侧登录区 */}
            <main className={'login-main'}>
                <div className={`login-card ${shaking ? 'is-shaking' : ''}`}>
                    {/* 小屏品牌头 */}
                    <div className={'login-mobile-brand'}>
                        <span className={'brand-mark'}>
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path
                                    pathLength="200"
                                    d="M8 34h11l5-13 8 26 6-18 4 5h14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span className={'login-mobile-title'}>随访管理系统</span>
                    </div>

                    <div className={'login-head'}>
                        <h2>欢迎登录</h2>
                        <p>请使用分配给你的账号进入系统</p>
                    </div>

                    <div className={'login-text'}>
                        <Form>
                            <Form.Item className={'login-field'}>
                                <Input
                                    size={'large'}
                                    autoComplete={'username'}
                                    placeholder='请输入用户名'
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    onPressEnter={loginSubmit}
                                    prefix={<UserOutlined/>}/>
                            </Form.Item>
                            <Form.Item className={'login-field'}>
                                <Input.Password
                                    size={'large'}
                                    autoComplete={'current-password'}
                                    placeholder='请输入密码'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onPressEnter={loginSubmit}
                                    prefix={<LockOutlined/>}/>
                            </Form.Item>
                        </Form>
                    </div>

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
                                className={'login-submit'}
                                loading={loading}
                                onClick={loginSubmit}
                                type='primary'
                                block
                                size={'large'}>
                                {loading ? '登录中' : '登 录'}
                            </Button>
                        </div>
                    </div>

                    <div className={'login-foot'}>
                        忘记密码请联系系统管理员重置
                    </div>
                </div>
            </main>
        </div>
    );
};
