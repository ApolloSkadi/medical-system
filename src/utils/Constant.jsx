
export default Object.freeze({
    FollowTypeOptions:[
        {
            label: '访视一',
            value: 1,
            color: 'primary'
        },
        {
            label: '访视二',
            value: 2,
            color: 'purple'
        }
        ,
        {
            label: '访视三',
            value: 3,
            color: 'orange'
        }
        ,
        {
            label: '其他',
            value: 4,
            color: 'red'
        }
    ],
    FollowStatusOptions:[
        {
            label: '待完成',
            value: 0,
            color: 'warning'
        },
        {
            label: '已完成',
            value: 1,
            color: 'success'
        },
        {
            label: '已取消',
            value: -1,
            color: 'error'
        },
    ],
    GenderOptions:[
        {
            label: '男',
            value: '男',
        },
        {
            label: '女',
            value: '女'
        }
    ],
    UserTypeOptions:[
        {
            label:'管理员',
            value: 1,
        },
        {
            label: '普通用户',
            value: 0,
        },
        {
            label: '平台管理员',
            value: 3,
        }
    ],
    OpenCloseOptions:[
        {
            label:'开启',
            value: 1,
            color: 'success'
        },
        {
            label: '封禁',
            value: 0,
            color: 'error'
        }
    ],
    StartCloseOptions:[
        {
            label:'开启',
            value: 1,
            color: 'success'
        },
        {
            label: '关闭',
            value: 0,
            color: 'error'
        }
    ],
    RCTFlagOptions:[
        {
            label: '是',
            value: 1
        },
        {
            label: '否',
            value: 0,
        }
    ],
    ProductModeOptions:[
        {
            label: '顺产',
            value: 1
        },
        {
            label: '剖腹产',
            value: 2
        },
    ],
    // ===== SaaS多租户管理 =====
    TenantTypeOptions:[
        {
            label: '医院',
            value: 1,
            color: 'primary'
        },
        {
            label: '研究中心',
            value: 2,
            color: 'purple'
        },
        {
            label: '联合体',
            value: 3,
            color: 'geekblue'
        }
    ],
    TenantStatusOptions:[
        {
            label: '启用',
            value: 1,
            color: 'success'
        },
        {
            label: '暂停',
            value: 2,
            color: 'warning'
        },
        {
            label: '终止',
            value: 3,
            color: 'error'
        }
    ],
    PlanOptions:[
        {
            label: '基础版',
            value: 1,
            color: 'primary'
        },
        {
            label: '专业版',
            value: 2,
            color: 'purple'
        },
        {
            label: '旗舰版',
            value: 3,
            color: 'orange'
        }
    ],
    SubscriptionStatusOptions:[
        {
            label: '有效',
            value: 1,
            color: 'success'
        },
        {
            label: '过期',
            value: 2,
            color: 'warning'
        },
        {
            label: '取消',
            value: 3,
            color: 'error'
        }
    ],
    ModuleOptions:[
        { label: '登录与用户', value: 'login' },
        { label: '首页看板', value: 'dashboard' },
        { label: '患儿队列', value: 'patient_queue' },
        { label: '数据录入', value: 'data_entry' },
        { label: 'Excel导入', value: 'excel_import' },
        { label: '数据导出', value: 'data_export' },
        { label: '数据质控', value: 'qc' },
        { label: '统计分析', value: 'statistics' },
        { label: '系统管理', value: 'system_admin' },
        { label: '介入前状态', value: 'pre_intervention' },
        { label: 'PBPV操作', value: 'pbpv' },
        { label: '超声检查', value: 'echo' },
        { label: 'CMR检查', value: 'cmr' },
        { label: '药物暴露', value: 'drug' },
        { label: '住院过程', value: 'hospitalization' },
        { label: '术后护理', value: 'nursing' },
        { label: '用户管理', value: 'user_manage' },
    ],
    RoleTypeOptions:[
        {
            label: '系统内置',
            value: 1,
            color: 'primary'
        },
        {
            label: '自定义',
            value: 2,
            color: 'purple'
        }
    ],
    DataScopeOptions:[
        {
            label: '全部',
            value: 1,
            color: 'success'
        },
        {
            label: '本中心',
            value: 2,
            color: 'primary'
        },
        {
            label: '仅本人',
            value: 3,
            color: 'warning'
        }
    ],
    ActionOptions:[
        {
            label: '查看',
            value: 1,
            color: 'primary'
        },
        {
            label: '新增',
            value: 2,
            color: 'success'
        },
        {
            label: '编辑',
            value: 3,
            color: 'orange'
        },
        {
            label: '删除',
            value: 4,
            color: 'error'
        },
        {
            label: '导出',
            value: 5,
            color: 'purple'
        },
        {
            label: '导入',
            value: 6,
            color: 'geekblue'
        },
        {
            label: '审批',
            value: 7,
            color: 'warning'
        }
    ],
    SourceTypeOptions:[
        {
            label: 'Excel',
            value: 1,
            color: 'primary'
        },
        {
            label: 'API',
            value: 2,
            color: 'success'
        },
        {
            label: 'HL7',
            value: 3,
            color: 'purple'
        },
        {
            label: '手工录入',
            value: 4,
            color: 'warning'
        }
    ],
})