import {Layout} from "antd";
import SideSystem from "./side"
import HeaderSystem from './header'
import TabBar from "./tabs"
import {useMenuStore} from "@/store/menu.js";
import useTabStore from "@/store/useTabStore.js";
import './index.scss';

const { Header, Content, Sider } = Layout;
export default ({children}) => {
    const menuCollapsed = useMenuStore(state => state.menuCollapsed);
    const setMenuCollapsed = useMenuStore(state => state.setMenuCollapsed);
    // 页签栏(开启且已打开页签时显示), 内容面板随之上方让位并去掉顶部圆角, 与页签栏连成一体
    const hasTabs = useTabStore(state => state.enabled && state.tabs.length > 0);
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
                    {hasTabs && <TabBar />}
                    <Content className={'main-content' + (hasTabs ? ' attached' : '')}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};
