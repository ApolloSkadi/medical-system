// 生成随机日期的辅助函数
const generateRandomDate = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// 生成随机时间
const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 10) + 8; // 8:00 - 18:00
    const minutes = ['00', '30'][Math.floor(Math.random() * 2)];
    return `${hours}:${minutes}`;
};

// 随访状态: pending-待完成, completed-已完成, cancelled-已取消
const followStatuses = ['pending', 'completed', 'cancelled'];

// 随访类型: 1-常规随访, 2-术后复查
const followTypes = [1, 2];

// 医生列表
const doctors = ['张医生', '李医生', '王医生', '赵医生', '陈医生'];

// 患者列表
const patients = [
    { id: 'P001', name: '张三' },
    { id: 'P002', name: '李四' },
    { id: 'P003', name: '王五' },
    { id: 'P004', name: '赵六' },
    { id: 'P005', name: '钱七' },
    { id: 'P006', name: '孙八' },
    { id: 'P007', name: '周九' },
    { id: 'P008', name: '吴十' },
];

// 生成随访日历数据
const generateFollowCalendarData = (chooseDate) => {
    const data = [];
    const today = new Date();
    const year = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    // 生成当月的随访数据
    for (let i = 0; i < 15; i++) {
        const patient = patients[Math.floor(Math.random() * patients.length)];
        const status = followStatuses[Math.floor(Math.random() * followStatuses.length)];
        const followType = followTypes[Math.floor(Math.random() * followTypes.length)];
        
        data.push({
            id: `F${String(i + 1).padStart(3, '0')}`,
            label: generateRandomDate(year, currentMonth),
            time: generateRandomTime(),
            patientId: patient.id,
            patientName: patient.name,
            doctorName: doctors[Math.floor(Math.random() * doctors.length)],
            followType: followType, // 1-常规随访, 2-术后复查
            status: status, // pending-待完成, completed-已完成, cancelled-已取消
        });
    }
    
    // 如果选择了特定日期，可以筛选返回
    if (chooseDate) {
        return data.filter(item => item.label === chooseDate);
    }
    
    return data;
};

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
            const { chooseDate } = req.body || {};
            return ({
                code: 'OK',
                data: generateFollowCalendarData(chooseDate)
            })
        }
    }
]