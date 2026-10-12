import {Button, Space, Tabs, Tooltip} from "antd";
import {CloseSquareOutlined, ColumnWidthOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import useTabStore from "@/store/useTabStore.js";

// 多页签导航栏: 页签与路由联动(进入页面自动开页签, 切换页签即路由跳转)。
// 页签关闭 = 对应页面卸载(内容不保留); 页签切换 = 仅隐藏, 内容保活。
export default () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {tabs, removeTab, removeOthers, removeAll} = useTabStore();
    const activeKey = location.pathname + location.search;
    if (!tabs.length) return null;

    const onChange = key => {
        const tab = tabs.find(t => t.key === key);
        if (tab) navigate(tab.path);
    };

    const onClose = key => {
        const idx = tabs.findIndex(t => t.key === key);
        const tab = tabs[idx];
        if (!tab || tab.closable === false) return;
        const next = tabs[idx + 1] ?? tabs[idx - 1];
        removeTab(key);
        // 关闭的是当前页签: 跳到相邻页签
        if (key === activeKey && next) navigate(next.path);
    };

    const closeOthers = () => {
        removeOthers(activeKey);
    };

    const closeAll = () => {
        const home = tabs.find(t => t.closable === false);
        removeAll();
        navigate(home ? home.path : '/');
    };

    return (
        <Tabs
            type="editable-card"
            size="small"
            hideAdd
            className="app-tabs"
            activeKey={activeKey}
            onChange={onChange}
            onEdit={(key, action) => action === 'remove' && onClose(key)}
            items={tabs.map(t => ({key: t.key, label: t.title, closable: t.closable !== false}))}
            tabBarExtraContent={{
                right: (
                    <Space size={2} className="tab-ops">
                        <Tooltip title="关闭除当前页签外的所有页签">
                            <Button type="text" size="small" icon={<ColumnWidthOutlined/>} onClick={closeOthers}>关闭其他</Button>
                        </Tooltip>
                        <Tooltip title="关闭全部页签并回到首页">
                            <Button type="text" size="small" icon={<CloseSquareOutlined/>} onClick={closeAll}>全部关闭</Button>
                        </Tooltip>
                    </Space>
                ),
            }}
        />
    );
};
