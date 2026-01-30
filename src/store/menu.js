import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
    // 菜单列表
    menuList: [],
    // 是否收缩
    menuCollapsed: false,
}

export const useMenuStore = create(
    persist(
        (set) => ({
            ...initialState,

            setMenuList: (menuList) => set({ menuList }),

            setMenuCollapsed: (menuCollapsed) => set({ menuCollapsed }),

            // 可选：重置
            resetMenu: () => set(initialState),
        }),
        {
            name: 'menu-store', // localStorage key（必须唯一）
            // 默认使用 localStorage
        }
    )
)