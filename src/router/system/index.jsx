import { HomeOutlined, TeamOutlined,MedicineBoxOutlined} from '@ant-design/icons';
import Main from "@/pages/system";
import Home from '@/pages/system/home';
import Patient from '@/pages/system/patient';
import PatientDetail from '@/pages/system/patient/detail';
import User from '@/pages/system/user';
export default [{
    path: '/',
    element: <Main/>,
    meta: {
        requiresAuth: true
    },
    children: [
        {
            path: 'dashboard',
            element: <Home/>,
            meta: {
                title: '首页',
                icon: 'HomeOutlined',
                roles: ['admin', 'user']
            }
        },
        {
            path: 'patient',
            element: <Patient/>,
            meta: {
                title: '患者管理',
                icon: 'MedicineBoxOutlined',
                roles: ['admin', 'user']
            }
        },
        {
            path: 'patient/detail/:id',
            element: <PatientDetail/>,
            meta: {
                title: '患者详情',
                icon: 'MedicineBoxOutlined',
                roles: ['admin', 'user'],
                hidden: true
            }
        },
        {
            path: 'user',
            element: <User/>,
            meta: {
                title: '用户管理',
                icon: 'TeamOutlined',
                roles: ['admin']
            }
        }
    ]
}]
