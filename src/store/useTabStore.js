import {create} from 'zustand';
import {persist} from 'zustand/middleware';

// 多页签状态:
// - enabled: 页签功能开关(持久化, 头部设置按钮控制); 关闭时清空页签并回退单页渲染;
// - tabs: 已打开页签列表(页面元素保持挂载, 隐藏不卸载 => 离开后返回内容不丢)。
// 激活页签不落库, 由当前路由(path + query)推导。
const useTabStore = create(persist((set) => ({
    enabled: true,
    tabs: [],

    setEnabled: enabled => set(enabled ? {enabled} : {enabled, tabs: []}),

    openTab: tab => set(state => state.tabs.some(t => t.key === tab.key)
        ? state
        : {tabs: [...state.tabs, tab]}),

    removeTab: key => set(state => ({tabs: state.tabs.filter(t => t.key !== key)})),

    // 关闭其他: 保留指定页签与常驻页签(如首页)
    removeOthers: key => set(state => ({
        tabs: state.tabs.filter(t => t.key === key || t.closable === false),
    })),

    // 全部关闭: 仅保留常驻页签
    removeAll: () => set(state => ({tabs: state.tabs.filter(t => t.closable === false)})),
}), {
    name: 'tab-store',
    // 仅持久化开关, 页签列表刷新后不保留(组件状态无法跨刷新)
    partialize: state => ({enabled: state.enabled}),
}));

export default useTabStore;
