import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {useMenuStore} from "@/store/menu.js";
import {getAuthRecord} from "@/utils/handler.jsx";

const initialState = {
    token: '',
    userInfo: null,
    role: '',
    // 权限码集合(RBAC授权+存量账号legacy兜底)，供菜单/路由/按钮控制
    permissions: [],
}

const useAuthStore = create(
    persist(
        (set, get) => ({
            // ===== 状态 =====
            ...initialState,

            // ===== 方法 =====
            login: ({ token, userInfo, role, permissions = [] }, navigate) => {
                set({
                    token,
                    userInfo,
                    role,
                    permissions: permissions ?? []
                })
                const menuList = getAuthRecord(role, permissions ?? [])
                const menuState = useMenuStore.getState()
                menuState.setMenuList(menuList ?? [])
                // 跳转到当前角色可访问的第一个菜单(如平台管理员进入SaaS租户管理)
                navigate(menuList?.[0]?.path ?? '/dashboard')
            },

            logout: navigate => {
                set(initialState)
                const menuState = useMenuStore.getState()
                menuState.setMenuList([])
                navigate('/login')
                localStorage.removeItem("userName")
                localStorage.removeItem("password")
                localStorage.removeItem("autoLogin")
            }
        }),
        {
            name: 'medical-auth', // localStorage key
            partialize: (state) => ({
                token: state.token,
                userInfo: state.userInfo,
                role: state.role,
                permissions: state.permissions
            }),
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useAuthStore