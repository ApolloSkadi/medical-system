import useAuthStore from "@/store/useAuthStore.js";

// 是否拥有权限码(路由/菜单/按钮统一入口)
// - 支持传入单个权限码或权限码数组(满足其一即可)
// - 平台管理员(platform)默认放行全部
// - permissions为空视为旧会话(登录接口尚未下发权限码)，不拦截，重新登录后生效
export const hasPermission = (code) => {
    const codes = Array.isArray(code) ? code.filter(v => v) : (code ? [code] : []);
    if (!codes.length) return true;
    const {role, permissions} = useAuthStore.getState();
    if (role === 'platform') return true;
    if (!permissions || !permissions.length) return true;
    return codes.some(item => permissions.includes(item));
};

// 权限码是否已下发(用于区分旧会话)
export const hasPermissionData = () => {
    const {permissions} = useAuthStore.getState();
    return Array.isArray(permissions) && permissions.length > 0;
};
