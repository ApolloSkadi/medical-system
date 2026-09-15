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
                    className={'app-sider'}
                    width={208}
                    collapsedWidth={64}
                    breakpoint={"xs"}
                    trigger={null}
                    collapsed={menuCollapsed}
                    // 小屏自动收起, 大屏保留用户上次的选择
                    onBreakpoint={(broken) => { if (broken) setMenuCollapsed(true) }}
                    onCollapse={(value) => {setMenuCollapsed(value)}}
                    collapsible
                >
                    <SideSystem />
                </Sider>
                <Layout>
                    <Header className={'app-header'}>
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
