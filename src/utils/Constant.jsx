
export default Object.freeze({
    FollowTypeOptions:[
        {
            label: '常规随访',
            value: 1,
            color: 'primary'
        },
        {
            label: '术后复查',
            value: 2,
            color: 'purple'
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
})