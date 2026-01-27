import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
            login: ({ token, userInfo, role }) => {
                set({
                    token,
                    userInfo,
                    role
                })
                const menuList = getAuthRecord(role)
                useMenuStore().setMenuList(menuList ?? [])
            },

            logout: () => {
                set(initialState)
                useMenuStore().setMenuList([])
            }
        }),
        {
            name: 'medical-auth', // localStorage key
            partialize: (state) => ({
                token: state.token,
                userInfo: state.userInfo,
                role: state.role
            })
        }
    )
)

export default useAuthStore