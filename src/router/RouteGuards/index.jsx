import useAuthStore from "@/store/useAuthStore.js";
import {useNavigate} from "react-router-dom";
import Config from "@/utils/config.js";
import {hasPermission} from "@/utils/permission.js";

export default ({children}) => {
    const { token, role } = useAuthStore()
    const navigate = useNavigate()
    if (children?.meta?.public) {
        return children
    }

    if (children?.meta?.requiresAuth && !token) {
        return navigate(Config.LoginPath)
    }

    if (children?.meta?.roles && !children?.meta.roles.includes(role)) {
        return navigate(Config.NotFoundPath)
    }

    // 操作级权限码控制(平台管理员/旧会话在hasPermission内放行)
    if (children?.meta?.permission && !hasPermission(children.meta.permission)) {
        return navigate(Config.NotFoundPath)
    }

    return children
}