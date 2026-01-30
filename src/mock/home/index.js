export default [
    {
        url: '/system/login',
        method: 'POST',
        timeout: 1000,
        response: (req, res) => {
            // 登录逻辑
            return ({
                code: 'OK',
                data: {
                    userName: 'admin',
                    gender: '女',
                    role: 'admin',
                    token: '114514'
                }
            })
        }
    },
    {
        url: '/system/followCalendar',
        method: 'POST',
        timeout: 500,
        response: (req, res) => {
            return ({
                code: 'OK',
                data: {

                }
            })
        }
    }
]