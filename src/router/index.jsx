import {createBrowserRouter, Navigate} from "react-router-dom";
import Pages from "@/Pages";
import systemRouter from '@/router/system'
import publicRouter from '@/router/publicly/index.jsx'
import Config from "@/utils/config.js";
import NotFount from '@/pages/404';

export default createBrowserRouter([
    {
        path:'/',
        element: <Pages />,
        meta: {
            public: true
        },
        children:[
            ...publicRouter,
            ...systemRouter,
            {
                path: Config.NotFoundPath,
                element: <NotFount/>,
                meta: {
                    public: true
                }
            },
            {
                path: '*',
                element: <Navigate to={Config.NotFoundPath}/>,
                meta: {
                    public: true
                }
            }
        ]
    }
])