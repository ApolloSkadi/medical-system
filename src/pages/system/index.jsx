import {useLayoutEffect, useMemo} from "react";
import {matchRoutes, useLocation, useOutlet} from "react-router-dom";
import MainLayout from "@/layout/MainLayout.jsx";
import RouteGuard from "@/router/RouteGuards";
import useTabStore from "@/store/useTabStore.js";
import useAuthStore from "@/store/useAuthStore.js";
import {hasPermission} from "@/utils/permission.js";
import systemRouter from '@/router/system';

// 展平路由树为绝对路径分支(父路径'/' + 相对子路径拼接), 供精确匹配当前路由。
// 惰性初始化: router/system与本模块存在循环引用, 必须在首次调用时(渲染期)再展开
let FLAT_ROUTES = null;
const getFlatRoutes = () => {
    if (!FLAT_ROUTES) {
        const flatten = (routes, parent = '') =>
            (routes ?? []).flatMap(r => {
                const full = r.path ? `${parent}/${r.path}`.replace(/\/+/g, '/') : parent;
                return [
                    ...(r.element && r.meta?.title ? [{...r, path: full}] : []),
                    ...flatten(r.children, full),
                ];
            });
        FLAT_ROUTES = flatten(systemRouter);
    }
    return FLAT_ROUTES;
};

// 在路由表中定位当前路径(含参数路由), 返回路由配置与路径参数
const matchRoute = pathname => {
    const matches = matchRoutes(getFlatRoutes(), pathname);
    if (!matches?.length) return null;
    return {route: matches[matches.length - 1].route, params: matches[matches.length - 1].params ?? {}};
};

// 首页页签常驻不可关闭
const HOME_TITLE = '首页';

// 系统布局挂载点: 多页签 + 内容保活
// - 进入带标题的路由自动登记页签(key = 路径+查询串, 同页面不同参数各自成页签);
// - 已打开页签的页面组件保持挂载(非激活页签隐藏不卸载), 切回后内容与离开时一致;
// - 未带标题的路由(404/重定向)或访问被拒时回退原Outlet渲染(由RouteGuard按原逻辑跳转)。
export default () => {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const role = useAuthStore(state => state.role);
    const tabEnabled = useTabStore(state => state.enabled);
    const tabs = useTabStore(state => state.tabs);
    const openTab = useTabStore(state => state.openTab);

    const activeKey = location.pathname + location.search;
    const matched = useMemo(() => matchRoute(location.pathname), [location.pathname]);
    const route = matched?.route;
    const routeTitle = route?.meta?.title;

    // 访问控制(与RouteGuard同规则): 角色不匹配或无权限码时不进入页签体系
    const accessDenied = !tabEnabled || !routeTitle
        || (route?.meta?.roles && !route.meta.roles.includes(role))
        || (route?.meta?.permission && !hasPermission(route.meta.permission));

    useLayoutEffect(() => {
        if (!tabEnabled || !routeTitle || accessDenied) return;
        // 登记页签(useLayoutEffect确保首屏绘制前完成, 避免页签栏闪烁)
        const paramSuffix = Object.values(matched?.params ?? {}).filter(Boolean).join('/');
        openTab({
            key: activeKey,
            path: activeKey,
            title: routeTitle + (paramSuffix ? ` ${paramSuffix}` : ''),
            closable: routeTitle !== HOME_TITLE,
            element: route.element,
        });
    }, [activeKey, routeTitle, accessDenied, matched, route, openTab]);

    const renderTabs = useMemo(() => {
        if (accessDenied) return null;
        if (tabs.some(t => t.key === activeKey)) return tabs;
        if (!routeTitle) return tabs;
        return [...tabs, {
            key: activeKey,
            path: activeKey,
            title: routeTitle,
            closable: routeTitle !== HOME_TITLE,
            element: route.element,
        }];
    }, [tabs, activeKey, routeTitle, accessDenied, route]);

    const content = renderTabs
        ? renderTabs.map(tab => (
            <div key={tab.key} style={{display: tab.key === activeKey ? 'block' : 'none'}}>
                {tab.element}
            </div>
        ))
        : <RouteGuard>{currentOutlet}</RouteGuard>;

    return (
        <MainLayout>
            {content}
        </MainLayout>
    );
};
