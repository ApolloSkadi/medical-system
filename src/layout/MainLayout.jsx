import {Layout} from "antd";
import SideSystem from "./side"
import HeaderSystem from './header'
import {useMenuStore} from "@/store/menu.js";
import './index.scss';

const { Header, Content, Sider } = Layout;
export default ({children}) => {
    const menuCollapsed = useMenuStore(state => state.menuCollapsed);
    const setMenuCollapsed = useMenuStore(state => state.setMenuCollapsed);
    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsedWidth={50}
                    breakpoint={"xs"}
                    onBreakpoint={(broken) => {
                        console.log('触发响应式',broken);
                    }}
                    collapsed={menuCollapsed}
                    onCollapse={(value) => {setMenuCollapsed(value)}}
                    collapsible
                >
                    <SideSystem />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <HeaderSystem />
                    </Header>
                    <Content className={'main-content'}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};