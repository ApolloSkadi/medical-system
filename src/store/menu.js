import {create} from "zustand";

const initialState = {
    // 菜单列表
    menuList:[],
    // 是否收缩
    menuCollapsed: false,
}
export const useMenuStore = create(
    (set) => (
        {
            ...initialState,
            setMenuList: menuList => set({menuList}),
            setMenuCollapsed: menuCollapsed => set({menuCollapsed}),
        }
    )
)