import {useEffect, useMemo, useState} from "react";
import {Button, DatePicker, Descriptions, Empty, message, Select, Table, Tabs, Tag} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import * as echarts from "echarts";
import useAuthStore from "@/store/useAuthStore.js";
import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import ReportChart from "./ReportChart.jsx";
import {ClinicalReportQuery, ClinicalUserList} from "@/api/system/clinical/index.js";
import {TenantList} from "@/api/system/saas/index.js";
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

// 术后护理折线: 按记录类别区分类别
const NURSING_CATEGORIES = ['体温', '心率', '呼吸频率', '血压', '大便次数'];

// 超声/CMR 折线可选指标(字段名 → 展示名)
const ECHO_METRICS = {
    lvef: 'LVEF(%)', lvfs: 'LVFS(%)', rvFac: 'RV-FAC(%)', tapse: 'TAPSE(mm)',
    lvedd: 'LVEDD(mm)', lvesd: 'LVESD(mm)', laDiameter: '左心房内径(mm)',
    trVelocity: 'TR流速(m/s)', mpaVelocity: 'MPA流速(m/s)', eOverEPrime: "E/E′", teiIndex: 'Tei指数',
};
const CMR_METRICS = {
    rvef: 'RVEF(%)', rvedv: 'RVEDV(ml)', rvesv: 'RVESV(ml)', rvEcv: '右心室ECV(%)',
    lvEcv: '左心室ECV(%)', trFraction: '三尖瓣反流分数(%)', hct: 'HCT',
};

const toMs = value => {
    if (value === undefined || value === null || value === '') return null;
    const date = dayjs(String(value).replace('T', ' ').slice(0, 16));
    return date.isValid() ? date.valueOf() : null;
};

// SaaS临床-综合报表: 按研究编号/住院编号一次查出关联的全部业务记录;
// 术后护理/药物暴露/超声/CMR 页签带图表化展示(折线/时间轴)与自定义日期范围
export default function ClinicalReport() {
    const role = useAuthStore(state => state.role);
    const isPlatform = role === 'platform';

    const [tenantId, setTenantId] = useState(undefined);
    const [subjectNo, setSubjectNo] = useState(undefined);
    const [recordNo, setRecordNo] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    // 术后护理/药物暴露 自定义日期范围(支持到小时), 超声/CMR 折线指标
    const [nursingRange, setNursingRange] = useState(undefined);
    const [drugRange, setDrugRange] = useState(undefined);
    const [echoMetric, setEchoMetric] = useState('lvef');
    const [cmrMetric, setCmrMetric] = useState('rvef');

    useEffect(() => {
        // 随访任务的负责人是用户id, 需要映射成姓名
        ClinicalUserList().then(res => {
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
        if (field?.type === 'datetime') return String(value).slice(0, 16).replace('T', ' ');
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

    // ===== 术后护理: 记录类别区分折线(横坐标记录时间, 数值需可解析), 支持日期范围到小时 =====
    const nursingData = result?.nursings ?? [];
    const filteredNursings = useMemo(() => {
        if (!nursingRange?.[0] || !nursingRange?.[1]) return nursingData;
        const start = nursingRange[0].valueOf();
        const end = nursingRange[1].valueOf();
        return nursingData.filter(row => {
            const ms = toMs(row.recordTime);
            return ms !== null && ms >= start && ms <= end;
        });
    }, [nursingData, nursingRange]);

    const nursingChartOption = useMemo(() => {
        const series = [];
        NURSING_CATEGORIES.forEach(category => {
            const points = filteredNursings
                .filter(row => row.category === category && !isNaN(Number(row.rawValue)) && row.rawValue !== '' && row.rawValue !== null)
                .map(row => [toMs(row.recordTime), Number(row.rawValue)])
                .filter(point => point[0] !== null)
                .sort((a, b) => a[0] - b[0]);
            if (points.length) {
                series.push({name: category, type: 'line', showSymbol: true, data: points, connectNulls: true});
            }
        });
        // 类别之外的数值型记录归为"其他"
        const known = new Set(NURSING_CATEGORIES);
        const otherPoints = filteredNursings
            .filter(row => !known.has(row.category) && !isNaN(Number(row.rawValue)) && row.rawValue !== '' && row.rawValue !== null)
            .map(row => [toMs(row.recordTime), Number(row.rawValue)])
            .filter(point => point[0] !== null)
            .sort((a, b) => a[0] - b[0]);
        if (otherPoints.length) {
            series.push({name: '其他', type: 'line', showSymbol: true, data: otherPoints});
        }
        return {
            tooltip: {trigger: 'axis'},
            legend: {top: 0},
            grid: {left: 48, right: 24, top: 36, bottom: 56},
            xAxis: {type: 'time'},
            yAxis: {type: 'value', scale: true},
            // 数据缩放: 支持在图上框选/拖拽日期范围
            dataZoom: [{type: 'inside'}, {type: 'slider', height: 18, bottom: 8}],
            series,
        };
    }, [filteredNursings]);

    // ===== 药物暴露: 用药时间轴(每行一个药物, 条形为开始~结束时间段) =====
    const drugData = result?.drugs ?? [];
    const filteredDrugs = useMemo(() => {
        if (!drugRange?.[0] || !drugRange?.[1]) return drugData;
        const start = drugRange[0].valueOf();
        const end = drugRange[1].valueOf();
        return drugData.filter(row => {
            const ms = toMs(row.startTime);
            return ms !== null && ms >= start && ms <= end;
        });
    }, [drugData, drugRange]);

    const drugChartOption = useMemo(() => {
        const labels = [];
        const labelIndex = new Map();
        const items = [];
        filteredDrugs.forEach(row => {
            const start = toMs(row.startTime);
            if (start === null) return;
            const label = row.route ? `${row.drugName}（${row.route}）` : (row.drugName ?? '未知药物');
            if (!labelIndex.has(label)) {
                labelIndex.set(label, labels.length);
                labels.push(label);
            }
            // 无结束时间按用药一天展示, 便于在时间轴上看到条形
            const stop = toMs(row.stopTime) ?? start + 24 * 3600 * 1000;
            items.push({name: label, value: [start, stop, labelIndex.get(label)], dose: row.dose, unit: row.doseUnit});
        });
        return {
            tooltip: {formatter: params => {
                const item = params.value;
                return `${params.name}<br/>${dayjs(item[0]).format('YYYY-MM-DD HH:mm')} ~ ${dayjs(item[1]).format('YYYY-MM-DD HH:mm')}`;
            }},
            grid: {left: 130, right: 30, top: 16, bottom: 40},
            xAxis: {type: 'time'},
            yAxis: {type: 'category', data: labels, inverse: true},
            dataZoom: [{type: 'inside'}, {type: 'slider', height: 18, bottom: 4}],
            series: [{
                type: 'custom',
                renderItem: (params, api) => {
                    const categoryIndex = api.value(2);
                    const start = api.coord([api.value(0), categoryIndex]);
                    const end = api.coord([api.value(1), categoryIndex]);
                    const barHeight = api.size([0, 1])[1] * 0.45;
                    const clip = echarts.graphic.clipRectByRect({
                        x: start[0], y: start[1] - barHeight / 2,
                        width: Math.max(end[0] - start[0], 2), height: barHeight,
                    }, {
                        x: params.coordSys.x, y: params.coordSys.y,
                        width: params.coordSys.width, height: params.coordSys.height,
                    });
                    return clip && {type: 'rect', shape: clip, style: api.style()};
                },
                data: items,
                encode: {x: [0, 1], y: 2},
                itemStyle: {color: '#2db7f5', opacity: 0.85},
            }],
        };
    }, [filteredDrugs]);

    // ===== 超声/CMR: 指标折线(横坐标检查日期) =====
    const echoData = result?.echos ?? [];
    const cmrData = result?.cmrs ?? [];

    const metricChartOption = (rows, timeField, metric, metricLabel) => {
        const points = rows
            .map(row => [toMs(row[timeField]), Number(row[metric])])
            .filter(point => point[0] !== null && !isNaN(point[1]))
            .sort((a, b) => a[0] - b[0]);
        return {
            tooltip: {trigger: 'axis'},
            grid: {left: 48, right: 24, top: 20, bottom: 40},
            xAxis: {type: 'time'},
            yAxis: {type: 'value', scale: true},
            dataZoom: [{type: 'inside'}],
            series: [{name: metricLabel, type: 'line', showSymbol: true, data: points, connectNulls: true}],
        };
    };

    const subject = result?.subject;
    const subjectFieldMap = Object.fromEntries(ClinicalConfigs.subject.fields.map(f => [f.name, f]));

    // 各页签展示内容: 带图表的页签为 图表区+明细表, 其余为明细表
    const renderTabContent = (configKey, rows) => {
        const config = ClinicalConfigs[configKey];
        const table = (
            <Table rowKey={'id'} size={'small'} columns={buildColumns(config)} dataSource={rows}
                   scroll={{x: 'max-content'}}
                   pagination={rows.length > 10 ? {pageSize: 10, showTotal: t => `共 ${t} 条`} : false}
                   locale={{emptyText: <Empty description={`暂无${config.title}记录`}/>}}/>
        );
        if (configKey === 'nursing') {
            // 展示依据: 记录类别/记录数值/记录单位/记录时间
            const nursingConfig = {...config, columns: ['category', 'rawValue', 'unit', 'recordTime']};
            const nursingTable = (
                <Table rowKey={'id'} size={'small'} columns={buildColumns(nursingConfig)} dataSource={filteredNursings}
                       pagination={filteredNursings.length > 10 ? {pageSize: 10, showTotal: t => `共 ${t} 条`} : false}
                       locale={{emptyText: <Empty description="暂无术后护理记录"/>}}/>
            );
            return (
                <>
                    <div style={{display: 'flex', alignItems: 'center', gap: '.6rem', margin: '.4rem 0 .6rem'}}>
                        <span style={{color: '#999', fontSize: 13}}>日期范围(到小时)</span>
                        <DatePicker.RangePicker
                            showTime={{format: 'HH:mm'}}
                            format="YYYY-MM-DD HH:mm"
                            value={nursingRange}
                            onChange={setNursingRange}
                            allowClear
                        />
                        <span style={{color: '#999', fontSize: 12}}>折线按记录类别区分数值记录, 图上可拖拽框选缩放</span>
                    </div>
                    {filteredNursings.length
                        ? <ReportChart option={nursingChartOption}/>
                        : <Empty description="暂无可绘制的数据(记录数值需为数字)"/>}
                    <div style={{marginTop: '1rem'}}>{nursingTable}</div>
                </>
            );
        }
        if (configKey === 'drug') {
            return (
                <>
                    <div style={{display: 'flex', alignItems: 'center', gap: '.6rem', margin: '.4rem 0 .6rem'}}>
                        <span style={{color: '#999', fontSize: 13}}>日期范围(到小时)</span>
                        <DatePicker.RangePicker
                            showTime={{format: 'HH:mm'}}
                            format="YYYY-MM-DD HH:mm"
                            value={drugRange}
                            onChange={setDrugRange}
                            allowClear
                        />
                        <span style={{color: '#999', fontSize: 12}}>每行一个药物, 条形为开始~结束时间段</span>
                    </div>
                    {filteredDrugs.length
                        ? <ReportChart option={drugChartOption}/>
                        : <Empty description="暂无可绘制的用药记录"/>}
                    <div style={{marginTop: '1rem'}}>{table}</div>
                </>
            );
        }
        if (configKey === 'echo' || configKey === 'cmr') {
            const isEcho = configKey === 'echo';
            const metrics = isEcho ? ECHO_METRICS : CMR_METRICS;
            const metric = isEcho ? echoMetric : cmrMetric;
            const metricLabel = metrics[metric] ?? metric;
            const rows = isEcho ? echoData : cmrData;
            const timeField = isEcho ? 'examTime' : 'examDate';
            return (
                <>
                    <div style={{display: 'flex', alignItems: 'center', gap: '.6rem', margin: '.4rem 0 .6rem'}}>
                        <span style={{color: '#999', fontSize: 13}}>选择指标</span>
                        <Select style={{width: '14rem'}} value={metric}
                                onChange={isEcho ? setEchoMetric : setCmrMetric}
                                options={Object.entries(metrics).map(([value, label]) => ({value, label}))}/>
                        <span style={{color: '#999', fontSize: 12}}>折线横坐标为检查日期</span>
                    </div>
                    {rows.length
                        ? <ReportChart option={metricChartOption(rows, timeField, metric, metricLabel)}/>
                        : <Empty description="暂无检查记录"/>}
                    <div style={{marginTop: '1rem'}}>{table}</div>
                </>
            );
        }
        return table;
    };

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
                                children: renderTabContent(tab.configKey, rows),
                            };
                        })}
                    />
                </div>
            )}
        </>
    );
}
