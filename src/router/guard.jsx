import { Navigate } from 'react-router-dom'
import useAuthStore from "@/store/useAuthStore.js";

export default function RouteGuard({ children, meta }) {
    const { token, role } = useAuthStore()

    if (meta?.public) {
        return children
    }

    if (meta?.requiresAuth && !token) {
        return <Navigate to="/login" replace />
    }

    if (meta?.roles && !meta.roles.includes(role)) {
        return <Navigate to="/403" replace />
    }

    return children
}