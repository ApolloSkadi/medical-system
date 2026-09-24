import {Menu} from "antd";
import {useMenuStore} from "@/store/menu.js";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {isNotNullArray, isNotNullObject} from "@/utils/handler.jsx";
import {
    AppstoreOutlined,
    BankOutlined,
    BellOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    DatabaseOutlined,
    DotChartOutlined,
    FileProtectOutlined,
    FileTextOutlined,
    HeartOutlined,
    HomeOutlined,
    KeyOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MedicineBoxOutlined,
    ProfileOutlined,
    RadarChartOutlined,
    ReconciliationOutlined,
    SolutionOutlined,
    TeamOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';

const iconMap = {
    HomeOutlined: <HomeOutlined />,
    TeamOutlined: <TeamOutlined />,
    MedicineBoxOutlined: <MedicineBoxOutlined />,
    BellOutlined: <BellOutlined/>,
    BankOutlined: <BankOutlined/>,
    CreditCardOutlined: <CreditCardOutlined/>,
    AppstoreOutlined: <AppstoreOutlined/>,
    SolutionOutlined: <SolutionOutlined/>,
    KeyOutlined: <KeyOutlined/>,
    DatabaseOutlined: <DatabaseOutlined/>,
    ReconciliationOutlined: <ReconciliationOutlined/>,
    HeartOutlined: <HeartOutlined/>,
    ThunderboltOutlined: <ThunderboltOutlined/>,
    RadarChartOutlined: <RadarChartOutlined/>,
    DotChartOutlined: <DotChartOutlined/>,
    FileTextOutlined: <FileTextOutlined/>,
    FileProtectOutlined: <FileProtectOutlined/>,
    CalendarOutlined: <CalendarOutlined/>,
    ProfileOutlined: <ProfileOutlined/>,
}

export default () => {
    const menuList = useMenuStore(state => state.menuList);
    const menuCollapsed = useMenuStore(state => state.menuCollapsed);
    const setMenuCollapsed = useMenuStore(state => state.setMenuCollapsed);
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
        // 设置菜单数据(style 中的 --i 用于菜单项交错入场)
        setRenderMenu(menuList.map((item, index) => ({
            key: item.path,
            icon: iconMap[item.icon] || null,
            label: item.label,
            path: item.path,
            style: {'--i': index},
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
        <div className={`side-panel ${menuCollapsed ? 'is-collapsed' : ''}`}>
            {/* 品牌区 */}
            <div className={'side-brand'}>
                <span className={'side-mark'}>
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
                <span className={'side-brand-text'}>
                    <span className={'side-brand-name'}>随访管理系统</span>
                    <span className={'side-brand-sub'}>SPIRR-PS-PA 临床试验</span>
                </span>
            </div>

            {/* 菜单区 */}
            <div className={'side-menu'}>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={currentMenuKey}
                    items={renderMenu}
                    inlineCollapsed={menuCollapsed}
                />
            </div>

            {/* 收起/展开 + 版本信息 */}
            <div className={'side-foot'}>
                <button
                    type={'button'}
                    className={'side-collapse'}
                    title={menuCollapsed ? '展开导航' : '收起导航'}
                    onClick={() => setMenuCollapsed(!menuCollapsed)}
                >
                    <span className={'collapse-icon'}>
                        {menuCollapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    </span>
                    <span className={'collapse-text'}>收起导航</span>
                </button>
                <div className={'side-copyright'}>
                    数据按租户隔离 · v1.0
                </div>
            </div>
        </div>
    );
};
