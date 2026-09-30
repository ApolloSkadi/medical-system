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
import './index.scss';

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

// 图表配色与坐标样式(设计规范参考 jimubi-dashboard skill: 轴标签#909198 网格#F3F3F3 标题#464646)
const CHART_COLORS = ['#1677ff', '#00b578', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'];
const CHART_AXIS = {axisLabel: {color: '#909198'}, splitLine: {lineStyle: {color: '#F3F3F3'}}};

const toMs = value => {
    if (value === undefined || value === null || value === '') return null;
    const date = dayjs(String(value).replace('T', ' ').slice(0, 16));
    return date.isValid() ? date.valueOf() : null;
};

// 卡片区块: 统一标题样式
const CardSection = ({title, extra, children}) => (
    <div className="report-card">
        <div className="report-card-title">
            {title}
            {extra && <span style={{fontWeight: 400, marginLeft: 'auto'}}>{extra}</span>}
        </div>
        {children}
    </div>
);

// SaaS临床-综合报表: 按研究编号/住院编号一次查出关联的全部业务记录;
// KPI概要+患者信息卡+图表化展示(术后护理折线/用药时间轴/检查指标折线), 设计参考 jimubi-dashboard 规范
export default function ClinicalReport() {
    const role = useAuthStore(state => state.role);
    const isPlatform = role === 'platform';

    const [tenantId, setTenantId] = useState(undefined);
    const [subjectNo, setSubjectNo] = useState(undefined);
    const [recordNo, setRecordNo] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    // 术后护理/药物暴露 自定义日期范围(支持到小时), 超声/CMR 折线指标(空=总览模式)
    const [nursingRange, setNursingRange] = useState(undefined);
    const [drugRange, setDrugRange] = useState(undefined);
    const [echoMetric, setEchoMetric] = useState('');
    const [cmrMetric, setCmrMetric] = useState('');

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

    // ===== KPI 概要(第一行4个指标卡) =====
    const kpis = useMemo(() => {
        const followUps = result?.followUps ?? [];
        const pending = followUps.filter(f => f.status === 1).length;
        const echoCount = (result?.echos ?? []).length;
        const cmrCount = (result?.cmrs ?? []).length;
        return [
            {label: '住院次数', value: (result?.hospitalizations ?? []).length},
            {label: '随访任务', value: followUps.length, sub: pending > 0 ? `待完成 ${pending}` : undefined},
            {label: '检查记录', value: echoCount + cmrCount, sub: `超声 ${echoCount} · CMR ${cmrCount}`},
            {label: '用药记录', value: (result?.drugs ?? []).length},
        ];
    }, [result]);

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
                .filter(row => row.category === category && row.rawValue !== '' && row.rawValue !== null && !isNaN(Number(row.rawValue)))
                .map(row => [toMs(row.recordTime), Number(row.rawValue)])
                .filter(point => point[0] !== null)
                .sort((a, b) => a[0] - b[0]);
            if (points.length) {
                series.push({name: category, type: 'line', showSymbol: true, smooth: true, data: points, connectNulls: true});
            }
        });
        // 类别之外的数值型记录归为"其他"
        const known = new Set(NURSING_CATEGORIES);
        const otherPoints = filteredNursings
            .filter(row => !known.has(row.category) && row.rawValue !== '' && row.rawValue !== null && !isNaN(Number(row.rawValue)))
            .map(row => [toMs(row.recordTime), Number(row.rawValue)])
            .filter(point => point[0] !== null)
            .sort((a, b) => a[0] - b[0]);
        if (otherPoints.length) {
            series.push({name: '其他', type: 'line', showSymbol: true, smooth: true, data: otherPoints});
        }
        return {
            color: CHART_COLORS,
            tooltip: {trigger: 'axis'},
            legend: {top: 0, textStyle: {color: '#464646'}},
            grid: {left: 48, right: 24, top: 40, bottom: 64},
            xAxis: {type: 'time', ...CHART_AXIS},
            yAxis: {type: 'value', scale: true, ...CHART_AXIS},
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
            color: CHART_COLORS,
            tooltip: {formatter: params => {
                const item = params.value;
                return `${params.name}<br/>${dayjs(item[0]).format('YYYY-MM-DD HH:mm')} ~ ${dayjs(item[1]).format('YYYY-MM-DD HH:mm')}`;
            }},
            grid: {left: 130, right: 30, top: 16, bottom: 44},
            xAxis: {type: 'time', ...CHART_AXIS},
            yAxis: {type: 'category', data: labels, inverse: true, axisLabel: {color: '#464646'}},
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
                itemStyle: {color: '#1677ff', opacity: 0.85, borderRadius: 4},
            }],
        };
    }, [filteredDrugs]);

    // ===== 超声/CMR: 指标折线(横坐标检查日期); mini=总览小图(无缩放条, 紧凑边距) =====
    const echoData = result?.echos ?? [];
    const cmrData = result?.cmrs ?? [];

    const metricChartOption = (rows, timeField, metric, metricLabel, mini) => {
        const points = rows
            .map(row => [toMs(row[timeField]), Number(row[metric])])
            .filter(point => point[0] !== null && !isNaN(point[1]))
            .sort((a, b) => a[0] - b[0]);
        const option = {
            color: CHART_COLORS,
            tooltip: {trigger: 'axis'},
            grid: mini ? {left: 46, right: 14, top: 14, bottom: 26} : {left: 48, right: 24, top: 20, bottom: 40},
            xAxis: {type: 'time', ...CHART_AXIS},
            yAxis: {type: 'value', scale: true, ...CHART_AXIS},
            series: [{name: metricLabel, type: 'line', showSymbol: true, smooth: true, data: points, connectNulls: true}],
        };
        if (!mini) option.dataZoom = [{type: 'inside'}];
        return option;
    };

    const subject = result?.subject;
    const subjectFieldMap = Object.fromEntries(ClinicalConfigs.subject.fields.map(f => [f.name, f]));
    // 研究对象资料卡: 全字段展示(姓名/研究编号已在头部; 长文本字段独占整行)
    const subjectFields = Object.keys(subjectFieldMap).filter(name => name !== 'name' && name !== 'subjectNo');

    // 明细表
    const renderTable = (config, rows) => (
        <Table rowKey={'id'} size={'small'} columns={buildColumns(config)} dataSource={rows}
               scroll={{x: 'max-content'}}
               pagination={rows.length > 10 ? {pageSize: 10, showTotal: t => `共 ${t} 条`} : false}
               locale={{emptyText: <Empty description={`暂无${config.title}记录`}/>}}/>
    );

    // 各页签展示内容: 图表卡片 + 明细卡片, 其余仅明细卡片
    const renderTabContent = (configKey, rows) => {
        const config = ClinicalConfigs[configKey];
        if (configKey === 'nursing') {
            // 展示依据: 记录类别/记录数值/记录单位/记录时间
            const nursingConfig = {...config, columns: ['category', 'rawValue', 'unit', 'recordTime']};
            return (
                <>
                    <CardSection title="术后护理趋势" extra={
                        <>
                            <span className="chart-hint">日期范围(到小时)</span>
                            <DatePicker.RangePicker
                                size="small"
                                showTime={{format: 'HH:mm'}}
                                format="YYYY-MM-DD HH:mm"
                                value={nursingRange}
                                onChange={setNursingRange}
                                allowClear
                            />
                        </>
                    }>
                        {filteredNursings.length
                            ? <ReportChart option={nursingChartOption}/>
                            : <Empty description="暂无可绘制的数据(记录数值需为数字)"/>}
                    </CardSection>
                    <CardSection title="护理明细">
                        {renderTable(nursingConfig, filteredNursings)}
                    </CardSection>
                </>
            );
        }
        if (configKey === 'drug') {
            return (
                <>
                    <CardSection title="用药时间轴" extra={
                        <>
                            <span className="chart-hint">日期范围(到小时)</span>
                            <DatePicker.RangePicker
                                size="small"
                                showTime={{format: 'HH:mm'}}
                                format="YYYY-MM-DD HH:mm"
                                value={drugRange}
                                onChange={setDrugRange}
                                allowClear
                            />
                        </>
                    }>
                        {filteredDrugs.length
                            ? <ReportChart option={drugChartOption}/>
                            : <Empty description="暂无可绘制的用药记录"/>}
                    </CardSection>
                    <CardSection title="用药明细">
                        {renderTable(config, rows)}
                    </CardSection>
                </>
            );
        }
        if (configKey === 'echo' || configKey === 'cmr') {
            const isEcho = configKey === 'echo';
            const metrics = isEcho ? ECHO_METRICS : CMR_METRICS;
            const metric = isEcho ? echoMetric : cmrMetric;
            const rows = isEcho ? echoData : cmrData;
            const timeField = isEcho ? 'examTime' : 'examDate';
            // 指标为空=总览模式: 全部指标小图矩阵
            const metricOptions = [{value: '', label: '总览(全部指标)'}, ...Object.entries(metrics).map(([value, label]) => ({value, label}))];
            return (
                <>
                    <CardSection title="指标趋势" extra={
                        <>
                            <span className="chart-hint">{metric ? '选择指标' : '总览模式'}</span>
                            <Select size="small" style={{width: '13rem'}} value={metric}
                                    onChange={isEcho ? setEchoMetric : setCmrMetric}
                                    options={metricOptions}/>
                        </>
                    }>
                        {rows.length ? (
                            metric
                                ? <ReportChart option={metricChartOption(rows, timeField, metric, metrics[metric] ?? metric)}/>
                                : <div className="metric-grid">
                                    {Object.entries(metrics).map(([field, label]) => {
                                        const hasData = rows.some(row => row[field] !== undefined && row[field] !== null && row[field] !== '' && !isNaN(Number(row[field])));
                                        if (!hasData) return null;
                                        return (
                                            <div className="metric-cell" key={field}>
                                                <div className="metric-cell-title">{label}</div>
                                                <ReportChart option={metricChartOption(rows, timeField, field, label, true)} height="9rem"/>
                                            </div>
                                        );
                                    })}
                                </div>
                        ) : <Empty description="暂无检查记录"/>}
                    </CardSection>
                    <CardSection title={`${config.title}明细`}>
                        {renderTable(config, rows)}
                    </CardSection>
                </>
            );
        }
        return (
            <CardSection title={`${config.title}明细`}>
                {renderTable(config, rows)}
            </CardSection>
        );
    };

    return (
        <div className="report-page">
            <div className="report-card">
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
            </div>
            {!result && (
                <Empty className="report-card" style={{marginTop: '2rem', padding: '3rem 0'}}
                       description={'输入研究编号或住院编号，查询该对象关联的全部业务记录'}/>
            )}
            {result && (
                <>
                    {/* KPI 概要: 第一行4个指标卡 */}
                    <div className="kpi-row">
                        {kpis.map(kpi => (
                            <div className="kpi-card" key={kpi.label}>
                                <div className="kpi-label">{kpi.label}</div>
                                <div className="kpi-value">
                                    {kpi.value}
                                    {kpi.sub && <span className="kpi-sub">{kpi.sub}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 患者信息卡 */}
                    <div className="report-card patient-card">
                        <div className="patient-name">
                            {subject?.name ?? '未知研究对象'}
                            <Tag color={'blue'}>{subject?.subjectNo}</Tag>
                        </div>
                        <div className="patient-meta">
                            {['gender', 'birthDate', 'diagnosisGroup', 'phone', 'admissionNo'].map(name => (
                                <span className="meta-item" key={name}>
                                    <span className="meta-label">{subjectFieldMap[name]?.label ?? name}</span>
                                    {renderCell(subjectFieldMap[name], subject?.[name])}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* 研究对象资料: 全字段 */}
                    <CardSection title="研究对象资料">
                        <div className="subject-grid">
                            {subjectFields.map(name => (
                                <div className={`subject-item${['nonCardiacDiagnosis', 'combinedCardiacDefect', 'remark'].includes(name) ? ' item-wide' : ''}`}
                                     key={name}>
                                    <span className="item-label">{subjectFieldMap[name]?.label ?? name}</span>
                                    <span className="item-value">{renderCell(subjectFieldMap[name], subject?.[name])}</span>
                                </div>
                            ))}
                        </div>
                    </CardSection>
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
                </>
            )}
        </div>
    );
}
