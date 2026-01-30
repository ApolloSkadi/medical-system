import {Avatar, Menu} from "antd";
import {useMenuStore} from "@/store/menu.js";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {isNotNullArray, isNotNullObject} from "@/utils/handler.jsx";
import { HomeOutlined, TeamOutlined, MedicineBoxOutlined} from '@ant-design/icons';
const iconMap = {
    HomeOutlined: <HomeOutlined />,
    TeamOutlined: <TeamOutlined />,
    MedicineBoxOutlined: <MedicineBoxOutlined />,
}

export default () => {
    const menuList = useMenuStore(state => state.menuList);
    const menuCollapsed = useMenuStore(state => state.menuCollapsed);
    // 导航栏参数配置
    const [renderMenu, setRenderMenu] = useState([]);
    // 是否为初始化
    const initRenderMenu = useRef(true);
    const navigate = useNavigate();
    // 当前选中一级菜单key
    const [currentMenuKey, setCurrentMenuKey] = useState('');
    const activeMenu = useMemo(
        () => menuList.find((item) => location.pathname === item.path),
        [menuList, location.pathname]
    )
    useEffect(() => {
        if (!isNotNullArray(menuList)) return
        // 设置菜单数据
        setRenderMenu(menuList.map((item, index) => ({
            key: item.path,
            icon: iconMap[item.icon] || null,
            label: item.label,
            path: item.path,
            onClick: () => handleMenuClick(item)
        })));
    }, [menuList]);

    const updateChangeCurrentMenu = () => {
        if (
            isNotNullArray(menuList) &&
            isNotNullObject(activeMenu)
        ) {
            // 更新选中一级菜单
            setCurrentMenuKey(activeMenu.path)
            initRenderMenu.current = false
        }
    }
    // 监听路由改变
    useEffect(updateChangeCurrentMenu, [location.pathname]);
    // 点击菜单时跳转
    const handleMenuClick = (menuItem) => {
        navigate(menuItem.path)
    }

    return (
        <div>
            {!menuCollapsed ?
                <div className={'sidebar'}>
                    <div className={'logo'}>
                        随访系统
                    </div>
                </div> :
                <div className={'sidebar'}>
                    <Avatar shape="square" size={50} src={'images/ps-logo-w.png'}/>
                </div>
            }
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={currentMenuKey}
                items={renderMenu}
                inlineCollapsed={menuCollapsed}
            />
        </div>
    );
};