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
// 路由解析
export const getAuthRecord = (role = useAuthStore().get().role) => {
    const menuList =[];
    routes.forEach(route => {
        if (route.meta?.requiresAuth) {
            if (isNotNullArray(route.children)) {
                route.children.forEach((item) => {
                    if (item.meta.roles.includes(role)) {
                        menuList.push({
                            path: route.path + item.path,
                            label: item.meta.title,
                            title: item.meta.title,
                            icon: item.meta.icon,
                        })
                    }
                })
            }
        }
    })
    return menuList
}