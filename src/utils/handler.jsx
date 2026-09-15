import {message} from "antd";
import useAuthStore from "@/store/useAuthStore.js";
import routes from "@/router/system";

// 判断数组是否有值
export const isNotNullArray = object => !!(Array.isArray(object) && object.filter(v => v).length)
// 判断对象是否有值
export const isNotNullObject = object => object && Boolean(Object.keys(object).length)
// 文本 复制
export const copyText = value => {
    navigator.clipboard
        .writeText(value)
        .then(() => {message.success('内容以复制')})
        .catch(() => {message.error('复制失败')});
}
// 权限码归一化: 支持配置单个权限码或权限码数组(满足其一即可)
const toPermissionCodes = permission => Array.isArray(permission) ? permission.filter(v => v) : (permission ? [permission] : [])
// 菜单可见性: 角色满足 且 权限码满足(旧会话未下发权限码时不拦截)
const checkMenuPermission = (permission, permissions) => {
    const codes = toPermissionCodes(permission)
    if (!codes.length) return true
    if (!Array.isArray(permissions) || !permissions.length) return true
    return codes.some(code => permissions.includes(code))
}
// 路由解析
export const getAuthRecord = (role = useAuthStore().get().role, permissions = useAuthStore.getState().permissions) => {
    const menuList = [];
    const legacyMenuList = [];
    routes.forEach(route => {
        if (route.meta?.requiresAuth) {
            if (isNotNullArray(route.children)) {
                route.children.forEach((item) => {
                    if (item.meta?.hidden) {
                        return
                    }
                    if (item.meta.roles.includes(role) && checkMenuPermission(item.meta.permission, permissions)) {
                        const menu = {
                            path: route.path + item.path,
                            label: item.meta.title,
                            title: item.meta.title,
                            icon: item.meta.icon,
                        }
                        item.meta.legacy ? legacyMenuList.push(menu) : menuList.push(menu)
                    }
                })
            }
        }
    })
    // 存量账号(持有legacy:*权限码)优先展示旧版页面，登录后落在旧版首页，避免进入无数据的SaaS看板
    const isLegacyAccount = Array.isArray(permissions) && permissions.some(code => String(code).startsWith('legacy:'))
    return isLegacyAccount ? [...legacyMenuList, ...menuList] : [...menuList, ...legacyMenuList]
}
