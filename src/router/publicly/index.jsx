import Config from "@/utils/config.js";
import Login from '@/pages/login';
import {Navigate} from "react-router-dom";

export default [
    {
        path: Config.LoginPath,
        element: <Login />,
        meta: {
            public: true
        }
    },
]