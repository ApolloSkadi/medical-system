import AvatarPopover from "@/layout/header/components/AvatarPopover.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useAuthStore from "@/store/useAuthStore.js";
import useTabStore from "@/store/useTabStore.js";
import {useMenuStore} from "@/store/menu.js";
import PwdChangeModal from "@/layout/header/components/PwdChangeModal/index.jsx";
import {useMemo, useRef, useState} from "react";
import {message, Tooltip} from "antd";
import {AppstoreOutlined, CalendarOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {EditUser} from "@/api/system/user/index.js";

export default () => {
    const navigate = useNavigate()
    const location = useLocation()
    const menuList = useMenuStore(state => state.menuList);
    const userLogout = useAuthStore().logout;
    // 修改密码
    const pwdFormRef = useRef()
    const [pwdForm, setPwdForm] = useState();
    // 修改密码方法
    const pwdSubmit = (data) => {
        return EditUser(data).then((res)=>{
            message.success(res.data)
            message.success('请重新登录')
            pwdFormRef.current?.close()
            userLogout(navigate)
        })
    }

    // 当前页面标题(取菜单标题, 首页兜底)
    const pageTitle = useMemo(() => {
        const matched = menuList?.find(item => item.path === location.pathname)
        return matched?.label ?? (location.pathname === '/dashboard' ? '首页' : '随访管理系统')
    }, [menuList, location.pathname])

    // 多页签开关(持久化, 关闭后回退单页渲染)
    const tabEnabled = useTabStore(state => state.enabled);
    const setTabEnabled = useTabStore(state => state.setEnabled);

    return (
        <div className={'header'}>
            {/* 当前页面信息(路由切换时重播入场动效) */}
            <div className={'header-left'} key={location.pathname}>
                <div className={'header-title'}>
                    <span className={'header-title-bar'}/>
                    {pageTitle}
                </div>
            </div>

            <div className={'header-right'}>
                {/* 多页签开关(图标按钮): 开启后各页面以页签方式打开, 切换不丢失页面内容 */}
                <Tooltip title={tabEnabled ? '多页签：已开启（点击关闭）' : '多页签：已关闭（点击开启）'}>
                    <span
                        className={'header-icon-btn' + (tabEnabled ? ' active' : '')}
                        onClick={() => setTabEnabled(!tabEnabled)}
                    >
                        <AppstoreOutlined/>
                    </span>
                </Tooltip>
                <div className={'header-date'}>
                    <CalendarOutlined/>
                    <span>{dayjs().format('YYYY年MM月DD日 dddd')}</span>
                </div>
                {/* 头像 */}
                <div className={'h-avatar'}>
                    <AvatarPopover
                        onLogout={() => userLogout(navigate)}
                        onEditPassword={() => pwdFormRef.current?.open({})}
                    />
                    <PwdChangeModal
                        form={pwdForm}
                        setForm={setPwdForm}
                        ref={pwdFormRef}
                        onSubmit={pwdSubmit}
                    />
                </div>
            </div>
        </div>
    );
};
