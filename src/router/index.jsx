import {useRoutes} from "react-router-dom";
import RouteGuard from "./guard.jsx";
import Error from '@/pages/404';
import Login from '@/pages/login';
import MainLayout from "@/layout/MainLayout.jsx";
import Home from '@/pages/system/home';
import Patient from '@/pages/system/patient';
import User from '@/pages/system/user';
import { HomeOutlined, TeamOutlined,MedicineBoxOutlined} from '@ant-design/icons';

export const routes =[
    {
        path:'/login',
        element: <Login/>,
        meta: {
            public: true
        }
    },
    {
        path:'/404',
        element: <Error/>,
        meta: {
            public: true
        }
    },
    {
        path: '/',
        element: <MainLayout/>,
        meta: {
            requiresAuth: true
        },
        children:[
            {
                path: 'dashboard',
                element: <Home/>,
                meta: {
                    title: '首页',
                    icon: <HomeOutlined/>,
                    roles: ['admin', 'user']
                }
            },
            {
                path: 'patient',
                element: <Patient/>,
                meta: {
                    title: '患者管理',
                    icon: <MedicineBoxOutlined/>,
                    roles: ['admin', 'user']
                }
            },
            {
                path: 'user',
                element: <User/>,
                meta: {
                    title: '用户管理',
                    icon: <TeamOutlined/>,
                    roles: ['admin']
                }
            }
        ]
    }
]

function renderRoutes(routes) {
    return routes.map(route => {
        if (route.children ){
            route.children = renderRoutes(route.children)
        }
        return {
            ...route,
            element: (
                <RouteGuard meta={route.meta}>
                    {route.element}
                </RouteGuard>
            )
        }
    })
}
export default function RouterView() {
    return useRoutes(renderRoutes(routes))
}