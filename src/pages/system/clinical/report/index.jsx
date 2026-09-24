import {useEffect, useMemo, useState} from "react";
import {Button, Descriptions, Empty, message, Table, Tabs, Tag} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import useAuthStore from "@/store/useAuthStore.js";
import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import {ClinicalReportQuery} from "@/api/system/clinical/index.js";
import {TenantList, UserRoleUserList} from "@/api/system/saas/index.js";
import {ClinicalConfigs} from "@/pages/system/clinical/configs.js";

const BOOL_OPTIONS = [{label: '是', value: 1}, {label: '否', value: 0}];

// 报表页签: 数据键 → 页面配置(顺序即展示顺序)
const REPORT_TABS = [
    {dataKey: 'hospitalizations', configKey: 'hospitalization'},
    {dataKey: 'preInterventions', configKey: 'preIntervention'},
    {dataKey: 'pbpvs', configKey: 'pbpv'},
    {dataKey: 'echos', configKey: 'echo'},
    {dataKey: 'cmrs', configKey: 'cmr'},
    {dataKey: 'drugs', configKey: 'drug'},
    {dataKey: 'nursings', configKey: 'nursing'},
    {dataKey: 'followUps', configKey: 'followUp'},
];

// 研究对象概要展示的字段
const SUBJECT_SUMMARY = ['subjectNo', 'outpatientNo', 'admissionNo', 'name', 'gender', 'diagnosisGroup', 'birthDate', 'phone', 'centerCode'];

// SaaS临床-综合报表: 按研究编号/住院编号一次查出关联的全部业务记录
export default function ClinicalReport() {
    const role = useAuthStore(state => state.role);
    const isPlatform = role === 'platform';

    const [tenantId, setTenantId] = useState(undefined);
    const [subjectNo, setSubjectNo] = useState(undefined);
    const [recordNo, setRecordNo] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [userOptions, setUserOptions] = useState([]);

    useEffect(() => {
        // 随访任务的负责人是用户id, 需要映射成姓名
        UserRoleUserList().then(res => {
            setUserOptions((res.data ?? []).map(u => ({
                label: u.realName ? `${u.realName}（${u.userName}）` : u.userName,
                value: u.id,
            })));
        });
    }, []);

    const userMap = useMemo(() => Object.fromEntries(userOptions.map(u => [String(u.value), u.label])), [userOptions]);

    const resolveOptions = (field) => {
        if (field?.type === 'bool') return BOOL_OPTIONS;
        if (field?.options) return field.options;
        if (field?.optionsApi === 'userList') return userOptions;
        return [];
    };

    const renderCell = (field, value) => {
        if (value === undefined || value === null || value === '') return '-';
        if (field?.type === 'select' || field?.type === 'bool') {
            const hit = resolveOptions(field).find(v => String(v.value) === String(value));
            return hit ? hit.label : String(value);
        }
        if (field?.type === 'date') return String(value).slice(0, 10);
        if (field?.type === 'datetime') return String(value).slice(0, 19).replace('T', ' ');
        return String(value);
    };

    const buildColumns = (config) => {
        const fieldMap = Object.fromEntries(config.fields.map(f => [f.name, f]));
        return config.columns.map(col => {
            const name = typeof col === 'string' ? col : col.name;
            const label = typeof col === 'string' ? (fieldMap[name]?.label ?? name) : col.label;
            return {
                title: label,
                dataIndex: name,
                key: name,
                render: value => renderCell(fieldMap[name], value),
            };
        });
    };

    const doQuery = () => {
        if (!subjectNo && !recordNo) {
            message.warning('请输入研究编号或住院编号');
            return;
        }
        setLoading(true);
        ClinicalReportQuery({subjectNo, recordNo, tenantId})
            .then(res => setResult(res.data ?? null))
            .finally(() => setLoading(false));
    };
    const onReset = () => {
        setSubjectNo(undefined);
        setRecordNo(undefined);
        setResult(null);
    };

    const subject = result?.subject;
    const subjectFieldMap = Object.fromEntries(ClinicalConfigs.subject.fields.map(f => [f.name, f]));

    return (
        <>
            <SearchRow>
                {isPlatform && (
                    <SearchRow.Item title={'租户'}>
                        <BaseAntdSelect
                            value={tenantId}
                            setValue={setTenantId}
                            style={{width: '14rem'}}
                            api={TenantList}
                            labelName={'tenantName'}
                            valueName={'id'}
                        />
                    </SearchRow.Item>
                )}
                <SearchRow.Item title={'研究编号'}>
                    <BaseAntdInput value={subjectNo} setValue={setSubjectNo}/>
                </SearchRow.Item>
                <SearchRow.Item title={'住院编号'}>
                    <BaseAntdInput value={recordNo} setValue={setRecordNo}/>
                </SearchRow.Item>
                <SearchRow.Item>
                    <Button type={'primary'} icon={<SearchOutlined/>} loading={loading} onClick={doQuery}>查询</Button>
                    <Button style={{marginLeft: '.6rem'}} onClick={onReset}>重置</Button>
                </SearchRow.Item>
            </SearchRow>
            {!result && (
                <Empty style={{marginTop: '6rem'}}
                       description={'输入研究编号或住院编号，查询该对象关联的全部业务记录'}/>
            )}
            {result && (
                <div style={{background: '#fff', padding: '1rem', borderRadius: '.5rem'}}>
                    <Descriptions
                        title={<span>研究对象 <Tag color={'blue'}>{subject?.subjectNo}</Tag></span>}
                        bordered size={'small'} column={3} style={{marginBottom: '1rem'}}
                    >
                        {SUBJECT_SUMMARY.map(name => (
                            <Descriptions.Item label={subjectFieldMap[name]?.label ?? name} key={name}>
                                {renderCell(subjectFieldMap[name], subject?.[name])}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                    <Tabs
                        items={REPORT_TABS.map(tab => {
                            const config = ClinicalConfigs[tab.configKey];
                            const rows = result[tab.dataKey] ?? [];
                            return {
                                key: tab.dataKey,
                                label: `${config.title}（${rows.length}）`,
                                children: (
                                    <Table
                                        rowKey={'id'}
                                        size={'small'}
                                        columns={buildColumns(config)}
                                        dataSource={rows}
                                        scroll={{x: 'max-content'}}
                                        pagination={rows.length > 10 ? {pageSize: 10, showTotal: t => `共 ${t} 条`} : false}
                                        locale={{emptyText: <Empty description={`暂无${config.title}记录`}/>}}
                                    />
                                ),
                            };
                        })}
                    />
                </div>
            )}
        </>
    );
}
