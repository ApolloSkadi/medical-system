import Main from "@/pages/system";
import Home from '@/pages/system/dashboard';
import LegacyHome from '@/pages/system/home';
import Patient from '@/pages/system/patient';
import PatientDetail from '@/pages/system/patient/detail';
import User from '@/pages/system/user';
import Subscribe from '@/pages/system/subscribe';
import SaasTenant from '@/pages/system/saas/tenant';
import SaasSubscription from '@/pages/system/saas/subscription';
import SaasModuleGrant from '@/pages/system/saas/moduleGrant';
import SaasRole from '@/pages/system/saas/role';
import SaasPermission from '@/pages/system/saas/permission';
import SaasDataSource from '@/pages/system/saas/dataSource';
import {createClinicalPage} from "@/pages/system/clinical/ClinicalPage.jsx";
import {ClinicalConfigs} from "@/pages/system/clinical/configs.js";

// SaaS临床业务页面(按文档第六章业务表生成，权限码控制)
const ClinicalSubject = createClinicalPage(ClinicalConfigs.subject);
const ClinicalPreIntervention = createClinicalPage(ClinicalConfigs.preIntervention);
const ClinicalPbpv = createClinicalPage(ClinicalConfigs.pbpv);
const ClinicalEcho = createClinicalPage(ClinicalConfigs.echo);
const ClinicalCmr = createClinicalPage(ClinicalConfigs.cmr);
const ClinicalDrug = createClinicalPage(ClinicalConfigs.drug);
const ClinicalHospitalization = createClinicalPage(ClinicalConfigs.hospitalization);
const ClinicalNursing = createClinicalPage(ClinicalConfigs.nursing);
const ClinicalFollowUp = createClinicalPage(ClinicalConfigs.followUp);
export default [{
    path: '/',
    element: <Main/>,
    meta: {
        requiresAuth: true
    },
    children: [
        // ===== 旧版页面(legacy) =====
        // 存量账号(type=1/2)由后端下发 legacy:* 权限码可见，新SaaS租户不下发这些码，
        // 菜单自动隐藏，实现"旧页面可控可见、逐步淘汰"
        {
            path: 'home',
            element: <LegacyHome/>,
            meta: {
                title: '首页看板(旧)',
                icon: 'CalendarOutlined',
                roles: ['admin', 'user'],
                permission: 'legacy:dashboard',
                legacy: true
            }
        },
        {
            path: 'patient',
            element: <Patient/>,
            meta: {
                title: '患者管理(旧)',
                icon: 'MedicineBoxOutlined',
                roles: ['admin', 'user'],
                permission: 'legacy:patient',
                legacy: true
            }
        },
        {
            path: 'patient/detail/:id',
            element: <PatientDetail/>,
            meta: {
                title: '患者详情',
                icon: 'MedicineBoxOutlined',
                roles: ['admin', 'user'],
                permission: 'legacy:patient',
                hidden: true,
                legacy: true
            }
        },
        {
            path: 'subscribe',
            element: <Subscribe/>,
            meta: {
                title: '提醒管理(旧)',
                icon: 'BellOutlined',
                roles: ['admin'],
                permission: 'legacy:subscribe',
                legacy: true
            }
        },
        // ===== 新版SaaS页面 =====
        {
            path: 'dashboard',
            element: <Home/>,
            meta: {
                title: '首页',
                icon: 'HomeOutlined',
                roles: ['admin', 'user', 'platform']
            }
        },
        {
            path: 'clinical/subject',
            element: <ClinicalSubject/>,
            meta: {
                title: '研究对象',
                icon: 'ReconciliationOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'patient_queue:view'
            }
        },
        {
            path: 'clinical/preIntervention',
            element: <ClinicalPreIntervention/>,
            meta: {
                title: '介入前状态',
                icon: 'HeartOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'pre_intervention:view'
            }
        },
        {
            path: 'clinical/pbpv',
            element: <ClinicalPbpv/>,
            meta: {
                title: 'PBPV操作',
                icon: 'ThunderboltOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'pbpv:view'
            }
        },
        {
            path: 'clinical/echo',
            element: <ClinicalEcho/>,
            meta: {
                title: '超声检查',
                icon: 'RadarChartOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'echo:view'
            }
        },
        {
            path: 'clinical/cmr',
            element: <ClinicalCmr/>,
            meta: {
                title: 'CMR检查',
                icon: 'DotChartOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'cmr:view'
            }
        },
        {
            path: 'clinical/drug',
            element: <ClinicalDrug/>,
            meta: {
                title: '药物暴露',
                icon: 'MedicineBoxOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'drug:view'
            }
        },
        {
            path: 'clinical/hospitalization',
            element: <ClinicalHospitalization/>,
            meta: {
                title: '住院过程',
                icon: 'FileTextOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'hospitalization:view'
            }
        },
        {
            path: 'clinical/nursing',
            element: <ClinicalNursing/>,
            meta: {
                title: '术后护理',
                icon: 'FileProtectOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'nursing:view'
            }
        },
        {
            path: 'clinical/followUp',
            element: <ClinicalFollowUp/>,
            meta: {
                title: '随访任务',
                icon: 'CalendarOutlined',
                roles: ['admin', 'user', 'platform'],
                permission: 'follow_up:view'
            }
        },
        {
            path: 'user',
            element: <User/>,
            meta: {
                title: '用户管理',
                icon: 'TeamOutlined',
                roles: ['admin', 'platform'],
                // 新角色用 user_manage:view，存量管理员用 legacy:user
                permission: ['user_manage:view', 'legacy:user']
            }
        },
        {
            path: 'saas/tenant',
            element: <SaasTenant/>,
            meta: {
                title: '租户管理',
                icon: 'BankOutlined',
                roles: ['platform']
            }
        },
        {
            path: 'saas/subscription',
            element: <SaasSubscription/>,
            meta: {
                title: '订阅管理',
                icon: 'CreditCardOutlined',
                roles: ['platform']
            }
        },
        {
            path: 'saas/moduleGrant',
            element: <SaasModuleGrant/>,
            meta: {
                title: '模块授权',
                icon: 'AppstoreOutlined',
                roles: ['platform']
            }
        },
        {
            path: 'saas/role',
            element: <SaasRole/>,
            meta: {
                title: '角色管理',
                icon: 'SolutionOutlined',
                roles: ['platform']
            }
        },
        {
            path: 'saas/permission',
            element: <SaasPermission/>,
            meta: {
                title: '权限项管理',
                icon: 'KeyOutlined',
                roles: ['platform']
            }
        },
        {
            path: 'saas/dataSource',
            element: <SaasDataSource/>,
            meta: {
                title: '数据源配置',
                icon: 'DatabaseOutlined',
                roles: ['platform']
            }
        }
    ]
}]
