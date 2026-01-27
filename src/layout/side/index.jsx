import {Layout, Menu} from "antd";
import {useState} from "react";
import {useMenuStore} from "@/store/menu.js";

const {Sider} = Layout;
export default () => {
    const menuList = useMenuStore(state => state.menuList);
    const menuCollapsed = useMenuStore(state => state.menuCollapsed);
    const setMenuCollapsed = useMenuStore(state => state.setMenuCollapsed());


    return (
        <>
            <Sider collapsible collapsed={menuCollapsed} onCollapse={(value) => {setMenuCollapsed(value)}}>
                <Menu items={menuList} inlineCollapsed={menuCollapsed}/>
            </Sider>
        </>
    );
};