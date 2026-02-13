
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
    ]
})