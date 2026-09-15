import AvatarPopover from "@/layout/header/components/AvatarPopover.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useAuthStore from "@/store/useAuthStore.js";
import {useMenuStore} from "@/store/menu.js";
import PwdChangeModal from "@/layout/header/components/PwdChangeModal/index.jsx";
import {useMemo, useRef, useState} from "react";
import {message} from "antd";
import {CalendarOutlined, HomeOutlined} from "@ant-design/icons";
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

    return (
        <div className={'header'}>
            {/* 当前页面信息(路由切换时重播入场动效) */}
            <div className={'header-left'} key={location.pathname}>
                <div className={'header-title'}>
                    <span className={'header-title-bar'}/>
                    {pageTitle}
                </div>
                <div className={'header-sub'}>
                    <HomeOutlined/>
                    SPIRR-PS-PA 临床试验数据平台
                </div>
            </div>

            <div className={'header-right'}>
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
