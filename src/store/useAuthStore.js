import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {useMenuStore} from "@/store/menu.js";
import {getAuthRecord} from "@/utils/handler.jsx";

const initialState = {
    token: '',
    userInfo: null,
    role: '',
}

const useAuthStore = create(
    persist(
        (set, get) => ({
            // ===== 状态 =====
            ...initialState,

            // ===== 方法 =====
            login: ({ token, userInfo, role }, navigate) => {
                set({
                    token,
                    userInfo,
                    role
                })
                const menuList = getAuthRecord(role)
                const menuState = useMenuStore.getState()
                menuState.setMenuList(menuList ?? [])
                console.log('准备跳转主页')
                navigate('/dashboard')
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
                role: state.role
            }),
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useAuthStore