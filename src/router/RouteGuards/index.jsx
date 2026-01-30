import useAuthStore from "@/store/useAuthStore.js";
import {useNavigate} from "react-router-dom";
import Config from "@/utils/config.js";

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

    return children
}