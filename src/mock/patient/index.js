// 患者列表数据
const patientList = [
    {
        id: 'P001',
        name: '张三',
        gender: '男',
        phone: '13800138001',
        outpatientNo: 'MZ20240001',
        inpatientNo: 'ZY20240001',
        birthDate: '2024-01-15T00:00:00.000Z',
        birthWeight: '3.5',
        gestationalAge: '38',
        surgeryAge: '30天',
        mainDiagnosis: '先天性心脏病-室间隔缺损',
        secondDiagnosis: '轻度肺动脉高压',
        baseCheckDate: '2024-02-01T00:00:00.000Z',
        baseCheckResult: '室间隔缺损约5mm，左向右分流，肺动脉压力轻度升高',
        checkMriRightPost: '450',
        checkMriRightNative: '1200',
        checkMriBloodPost: '180',
        checkMriBloodNative: '1600',
        checkMriHct: '0.45',
        checkMriEcv: '28.5',
        allergyHistory: false,
        medicalHistory: false,
        metalImplantHistory: false,
    },
    {
        id: 'P002',
        name: '李四',
        gender: '女',
        phone: '13800138002',
        outpatientNo: 'MZ20240002',
        inpatientNo: 'ZY20240002',
        birthDate: '2024-02-20T00:00:00.000Z',
        birthWeight: '2.8',
        gestationalAge: '36',
        surgeryAge: '45天',
        mainDiagnosis: '先天性心脏病-房间隔缺损',
        secondDiagnosis: '无',
        baseCheckDate: '2024-03-15T00:00:00.000Z',
        baseCheckResult: '房间隔缺损约8mm，中央型，右心房轻度增大',
        checkMriRightPost: '420',
        checkMriRightNative: '1100',
        checkMriBloodPost: '160',
        checkMriBloodNative: '1500',
        checkMriHct: '0.42',
        checkMriEcv: '26.8',
        allergyHistory: true,
        medicalHistory: false,
        metalImplantHistory: false,
    },
    {
        id: 'P003',
        name: '王五',
        gender: '男',
        phone: '13800138003',
        outpatientNo: 'MZ20240003',
        inpatientNo: 'ZY20240003',
        birthDate: '2023-12-10T00:00:00.000Z',
        birthWeight: '3.2',
        gestationalAge: '39',
        surgeryAge: '60天',
        mainDiagnosis: '法洛四联症',
        secondDiagnosis: '右心室流出道狭窄',
        baseCheckDate: '2024-01-20T00:00:00.000Z',
        baseCheckResult: '法洛四联症术后，右心室流出道残余狭窄，需定期随访',
        checkMriRightPost: '480',
        checkMriRightNative: '1300',
        checkMriBloodPost: '190',
        checkMriBloodNative: '1700',
        checkMriHct: '0.48',
        checkMriEcv: '30.2',
        allergyHistory: false,
        medicalHistory: true,
        metalImplantHistory: false,
    },
    {
        id: 'P004',
        name: '赵六',
        gender: '女',
        phone: '13800138004',
        outpatientNo: 'MZ20240004',
        inpatientNo: 'ZY20240004',
        birthDate: '2024-03-05T00:00:00.000Z',
        birthWeight: '3.0',
        gestationalAge: '37',
        surgeryAge: '20天',
        mainDiagnosis: '动脉导管未闭',
        secondDiagnosis: '无',
        baseCheckDate: '2024-04-01T00:00:00.000Z',
        baseCheckResult: '动脉导管未闭约3mm，连续性杂音明显',
        checkMriRightPost: '400',
        checkMriRightNative: '1050',
        checkMriBloodPost: '155',
        checkMriBloodNative: '1450',
        checkMriHct: '0.40',
        checkMriEcv: '25.5',
        allergyHistory: false,
        medicalHistory: false,
        metalImplantHistory: true,
    },
    {
        id: 'P005',
        name: '钱七',
        gender: '男',
        phone: '13800138005',
        outpatientNo: 'MZ20240005',
        inpatientNo: 'ZY20240005',
        birthDate: '2024-01-25T00:00:00.000Z',
        birthWeight: '3.8',
        gestationalAge: '40',
        surgeryAge: '35天',
        mainDiagnosis: '主动脉缩窄',
        secondDiagnosis: '二尖瓣轻度反流',
        baseCheckDate: '2024-02-28T00:00:00.000Z',
        baseCheckResult: '主动脉缩窄术后，血压控制良好，二尖瓣轻度反流',
        checkMriRightPost: '430',
        checkMriRightNative: '1150',
        checkMriBloodPost: '170',
        checkMriBloodNative: '1550',
        checkMriHct: '0.44',
        checkMriEcv: '27.3',
        allergyHistory: true,
        medicalHistory: true,
        metalImplantHistory: false,
    },
    {
        id: 'P006',
        name: '孙八',
        gender: '女',
        phone: '13800138006',
        outpatientNo: 'MZ20240006',
        inpatientNo: 'ZY20240006',
        birthDate: '2024-02-10T00:00:00.000Z',
        birthWeight: '2.5',
        gestationalAge: '35',
        surgeryAge: '50天',
        mainDiagnosis: '完全性大动脉转位',
        secondDiagnosis: '室间隔缺损',
        baseCheckDate: '2024-03-20T00:00:00.000Z',
        baseCheckResult: 'Switch术后，心功能恢复良好，室间隔缺损已闭合',
        checkMriRightPost: '460',
        checkMriRightNative: '1250',
        checkMriBloodPost: '175',
        checkMriBloodNative: '1650',
        checkMriHct: '0.46',
        checkMriEcv: '29.1',
        allergyHistory: false,
        medicalHistory: false,
        metalImplantHistory: false,
    },
    {
        id: 'P007',
        name: '周九',
        gender: '男',
        phone: '13800138007',
        outpatientNo: 'MZ20240007',
        inpatientNo: 'ZY20240007',
        birthDate: '2024-03-18T00:00:00.000Z',
        birthWeight: '3.3',
        gestationalAge: '38',
        surgeryAge: '15天',
        mainDiagnosis: '肺动脉狭窄',
        secondDiagnosis: '无',
        baseCheckDate: '2024-04-10T00:00:00.000Z',
        baseCheckResult: '肺动脉瓣狭窄，跨瓣压差约40mmHg',
        checkMriRightPost: '440',
        checkMriRightNative: '1180',
        checkMriBloodPost: '165',
        checkMriBloodNative: '1520',
        checkMriHct: '0.43',
        checkMriEcv: '27.8',
        allergyHistory: false,
        medicalHistory: false,
        metalImplantHistory: false,
    },
    {
        id: 'P008',
        name: '吴十',
        gender: '女',
        phone: '13800138008',
        outpatientNo: 'MZ20240008',
        inpatientNo: 'ZY20240008',
        birthDate: '2024-01-08T00:00:00.000Z',
        birthWeight: '3.6',
        gestationalAge: '39',
        surgeryAge: '40天',
        mainDiagnosis: '三尖瓣下移畸形',
        secondDiagnosis: '房间隔缺损',
        baseCheckDate: '2024-02-15T00:00:00.000Z',
        baseCheckResult: 'Ebstein畸形，三尖瓣隔瓣下移约2cm，重度反流',
        checkMriRightPost: '470',
        checkMriRightNative: '1280',
        checkMriBloodPost: '185',
        checkMriBloodNative: '1680',
        checkMriHct: '0.47',
        checkMriEcv: '29.8',
        allergyHistory: true,
        medicalHistory: false,
        metalImplantHistory: false,
    },
];

// 生成分页数据
const generatePageData = (page, pageSize, name) => {
    let filteredList = patientList;
    
    // 按姓名筛选
    if (name) {
        filteredList = patientList.filter(item => 
            item.name.includes(name)
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
    {
        url: '/system/patient/page',
        method: 'POST',
        timeout: 500,
        response: (req, res) => {
            const { page = 1, pageSize = 10, name } = req.body || {};
            return {
                code: 'OK',
                data: generatePageData(page, pageSize, name)
            };
        }
    },
    {
        url: '/system/patient/detail',
        method: 'POST',
        timeout: 300,
        response: (req, res) => {
            const { id } = req.body || {};
            const patient = patientList.find(item => item.id === id);
            
            if (patient) {
                return {
                    code: 'OK',
                    data: patient
                };
            }
            
            return {
                code: 'NOT_FOUND',
                message: '患者不存在',
                data: null
            };
        }
    },
    {
        url: '/system/patient/saveOrEdit',
        method: 'POST',
        timeout: 300,
        response: (req, res) => {
            return {
                code: 'OK',
                data: '操作成功'
            };
        }
    }
];
