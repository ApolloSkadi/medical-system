// 用户列表数据
const userList = [
    {
        id: 'U001',
        userName: 'admin',
        password: '123456',
        realName: '系统管理员',
        gender: '女',
        role: 'admin',
        phone: '13800000001',
        email: 'admin@hospital.com',
        department: '信息科',
        status: 1, // 1-启用, 0-禁用
        createTime: '2024-01-01T00:00:00.000Z',
        lastLoginTime: '2024-06-15T08:30:00.000Z',
    },
    {
        id: 'U002',
        userName: 'doctor01',
        password: '123456',
        realName: '张医生',
        gender: '男',
        role: 'doctor',
        phone: '13800000002',
        email: 'zhang@hospital.com',
        department: '心内科',
        status: 1,
        createTime: '2024-01-15T00:00:00.000Z',
        lastLoginTime: '2024-06-14T14:20:00.000Z',
    },
    {
        id: 'U003',
        userName: 'doctor02',
        password: '123456',
        realName: '李医生',
        gender: '女',
        role: 'doctor',
        phone: '13800000003',
        email: 'li@hospital.com',
        department: '心外科',
        status: 1,
        createTime: '2024-02-01T00:00:00.000Z',
        lastLoginTime: '2024-06-13T09:15:00.000Z',
    },
    {
        id: 'U004',
        userName: 'nurse01',
        password: '123456',
        realName: '王护士',
        gender: '女',
        role: 'nurse',
        phone: '13800000004',
        email: 'wang@hospital.com',
        department: '心内科',
        status: 1,
        createTime: '2024-02-15T00:00:00.000Z',
        lastLoginTime: '2024-06-15T07:45:00.000Z',
    },
    {
        id: 'U005',
        userName: 'researcher01',
        password: '123456',
        realName: '赵研究员',
        gender: '男',
        role: 'researcher',
        phone: '13800000005',
        email: 'zhao@hospital.com',
        department: '科研部',
        status: 1,
        createTime: '2024-03-01T00:00:00.000Z',
        lastLoginTime: '2024-06-12T16:30:00.000Z',
    },
];

// 角色选项
const roleOptions = [
    { value: 'admin', label: '系统管理员' },
    { value: 'doctor', label: '医生' },
    { value: 'nurse', label: '护士' },
    { value: 'researcher', label: '研究员' },
];

// 科室选项
const departmentOptions = [
    { value: '信息科', label: '信息科' },
    { value: '心内科', label: '心内科' },
    { value: '心外科', label: '心外科' },
    { value: '儿科', label: '儿科' },
    { value: '科研部', label: '科研部' },
];

// 生成分页数据
const generatePageData = (page, pageSize, filters = {}) => {
    let filteredList = userList;
    
    // 按用户名筛选
    if (filters.userName) {
        filteredList = filteredList.filter(item => 
            item.userName.includes(filters.userName)
        );
    }
    
    // 按真实姓名筛选
    if (filters.realName) {
        filteredList = filteredList.filter(item => 
            item.realName.includes(filters.realName)
        );
    }
    
    // 按角色筛选
    if (filters.role) {
        filteredList = filteredList.filter(item => 
            item.role === filters.role
        );
    }
    
    // 按科室筛选
    if (filters.department) {
        filteredList = filteredList.filter(item => 
            item.department === filters.department
        );
    }
    
    // 按状态筛选
    if (filters.status !== undefined && filters.status !== null) {
        filteredList = filteredList.filter(item => 
            item.status === filters.status
        );
    }
    
    const total = filteredList.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredList.slice(startIndex, endIndex);
    
    return {
        list,
        total,
        page,
        pageSize,
    };
};

export default [
    // 用户登录
    {
        url: '/user/login',
        method: 'POST',
        timeout: 500,
        response: (req, res) => {
            const { userName, password } = req.body || {};
            const user = userList.find(item => 
                item.userName === userName && item.password === password
            );
            
            if (user) {
                return {
                    code: 'OK',
                    data: {
                        id: user.id,
                        userName: user.userName,
                        realName: user.realName,
                        gender: user.gender,
                        role: user.role,
                        phone: user.phone,
                        email: user.email,
                        department: user.department,
                        token: `token_${user.id}_${Date.now()}`
                    }
                };
            }
            
            return {
                code: 'AUTH_FAILED',
                message: '用户名或密码错误',
                data: null
            };
        }
    },
    
    // 获取用户列表（分页）
    {
        url: '/user/page',
        method: 'POST',
        timeout: 500,
        response: (req, res) => {
            const { page = 1, pageSize = 10, ...filters } = req.body || {};
            return {
                code: 'OK',
                data: generatePageData(page, pageSize, filters)
            };
        }
    },
    
    // 获取用户详情
    {
        url: '/user/detail',
        method: 'POST',
        timeout: 300,
        response: (req, res) => {
            const { id } = req.body || {};
            const user = userList.find(item => item.id === id);
            
            if (user) {
                // 不返回密码
                const { password, ...userInfo } = user;
                return {
                    code: 'OK',
                    data: userInfo
                };
            }
            
            return {
                code: 'NOT_FOUND',
                message: '用户不存在',
                data: null
            };
        }
    },
    
    // 新增用户
    {
        url: '/user/add',
        method: 'POST',
        timeout: 300,
        response: (req, res) => {
            const userData = req.body || {};
            const newUser = {
                id: `U${String(userList.length + 1).padStart(3, '0')}`,
                ...userData,
                status: 1,
                createTime: new Date().toISOString(),
            };
            userList.push(newUser);
            
            return {
                code: 'OK',
                message: '新增成功',
                data: { id: newUser.id }
            };
        }
    },
    
    // 更新用户
    {
        url: '/user/update',
        method: 'POST',
        timeout: 300,
        response: (req, res) => {
            const { id, ...updateData } = req.body || {};
            const index = userList.findIndex(item => item.id === id);
            
            if (index !== -1) {
                userList[index] = { ...userList[index], ...updateData };
                return {
                    code: 'OK',
                    message: '更新成功'
                };
            }
            
            return {
                code: 'NOT_FOUND',
                message: '用户不存在'
            };
        }
    },
    
    // 删除用户
    {
        url: '/user/delete',
        method: 'POST',
        timeout: 300,
        response: (req, res) => {
            const { id } = req.body || {};
            const index = userList.findIndex(item => item.id === id);
            
            if (index !== -1) {
                userList.splice(index, 1);
                return {
                    code: 'OK',
                    message: '删除成功'
                };
            }
            
            return {
                code: 'NOT_FOUND',
                message: '用户不存在'
            };
        }
    },
    
    // 获取角色选项
    {
        url: '/user/roleOptions',
        method: 'POST',
        timeout: 100,
        response: (req, res) => {
            return {
                code: 'OK',
                data: roleOptions
            };
        }
    },
    
    // 获取科室选项
    {
        url: '/user/departmentOptions',
        method: 'POST',
        timeout: 100,
        response: (req, res) => {
            return {
                code: 'OK',
                data: departmentOptions
            };
        }
    },
];
