import {useCallback, useEffect, useMemo, useState} from "react";
import {Calendar, Button, Card, Col, Empty, Progress, Row, Skeleton, Table, Tag, Tooltip} from "antd";
import {
    CalendarOutlined,
    DotChartOutlined,
    FileDoneOutlined,
    LeftOutlined,
    RadarChartOutlined,
    ReloadOutlined,
    RightOutlined,
    TeamOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {DashboardStats, DashboardCalendar} from "@/api/system/clinical/index.js";
import useAuthStore from "@/store/useAuthStore.js";
import {useCountUp, useReveal} from "./hooks.js";
import "./index.scss";

// 随访状态(1待完成 2已完成 3逾期 4已取消)
const FOLLOW_STATUS = {1: ['待完成', 'warning'], 2: ['已完成', 'success'], 3: ['逾期', 'error'], 4: ['已取消', 'default']};
const FOLLOW_TYPE = {1: '超声', 2: 'CMR', 3: '门诊', 4: '其他'};
const FOLLOW_STATUS_COLOR = {1: '#faad14', 2: '#52c41a', 3: '#ff4d4f', 4: '#ccc'};
const ROLE_LABEL = {admin: '管理员', user: '普通用户', platform: '平台管理员'};

const formatDate = value => {
    if (!value) return '-';
    const date = dayjs(value);
    return date.isValid() ? date.format('YYYY-MM-DD') : String(value).slice(0, 10);
};

// 分块入场动效容器(延迟用于制造交错节奏)
const Reveal = ({delay = 0, className = '', children, ...rest}) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            className={`dash-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
            style={{'--delay': `${delay}ms`}}
            {...rest}
        >
            {children}
        </div>
    );
};

// 指标卡: 数字滚动 + 悬浮抬升 + 高光扫过
const KpiCard = ({item, index}) => {
    const value = useCountUp(item.value ?? 0, 1000 + index * 60);
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            className={`kpi-card ${visible ? 'is-visible' : ''}`}
            style={{'--accent': item.color, '--accent-soft': `${item.color}22`, '--i': index}}
        >
            <span className="kpi-icon">{item.icon}</span>
            <div className="kpi-body">
                <div className="kpi-value">
                    {value}
                    <span className="kpi-unit">{item.unit ?? '人'}</span>
                </div>
                <div className="kpi-label">{item.title}</div>
            </div>
            {item.alert && <span className="kpi-dot" title="存在逾期任务"/>}
        </div>
    );
};

// 诊断组构成环形图(纯 SVG 绘制, 不依赖图片资源)
const DiagnosisRing = ({psCount = 0, paCount = 0}) => {
    const [ref, visible] = useReveal({threshold: 0.2});
    const total = psCount + paCount;
    const psRatio = total ? psCount / total : 0;
    const percent = Math.round(psRatio * 100);
    const shownPercent = useCountUp(percent, 1100);
    const radius = 62;
    const circumference = 2 * Math.PI * radius;

    return (
        <div ref={ref} className={`dash-ring ${visible ? 'is-visible' : ''}`}>
            <div className="dash-ring-chart">
                <svg viewBox="0 0 160 160" role="img" aria-label={`PS 占比 ${percent}%`}>
                    <circle className="dash-ring-track" cx="80" cy="80" r={radius}/>
                    <circle
                        className="dash-ring-seg seg-ps"
                        cx="80" cy="80" r={radius}
                        strokeDasharray={visible ? `${psRatio * circumference} ${circumference}` : `0 ${circumference}`}
                    />
                    <circle
                        className="dash-ring-seg seg-pa"
                        cx="80" cy="80" r={radius}
                        strokeDasharray={visible ? `${(1 - psRatio) * circumference} ${circumference}` : `0 ${circumference}`}
                        strokeDashoffset={visible ? -psRatio * circumference : 0}
                    />
                </svg>
                <div className="dash-ring-center">
                    <div className="dash-ring-percent">{shownPercent}%</div>
                    <div className="dash-ring-caption">PS 占比</div>
                </div>
            </div>
            <ul className="dash-ring-legend">
                <li>
                    <span className="legend-dot" style={{'--accent': '#2db7f5'}}/>
                    <span className="legend-label">PS 大动脉狭窄</span>
                    <span className="legend-value">{psCount}</span>
                </li>
                <li>
                    <span className="legend-dot" style={{'--accent': '#722ed1'}}/>
                    <span className="legend-label">PA_IVS 室间隔完整型</span>
                    <span className="legend-value">{paCount}</span>
                </li>
                <li className="legend-total">
                    <span className="legend-dot" style={{'--accent': '#8c8c8c'}}/>
                    <span className="legend-label">合计</span>
                    <span className="legend-value">{total}</span>
                </li>
            </ul>
        </div>
    );
};

// 随访状态进度条(数值滚动 + 进度条生长)
const StatusBar = ({label, value, total, color}) => {
    const shownValue = useCountUp(value ?? 0);
    const percent = total ? Math.round((value ?? 0) / total * 100) : 0;
    return (
        <div className="status-row">
            <div className="status-row-head">
                <span className="status-row-label">
                    <span className="status-dot" style={{'--accent': color}}/>
                    {label}
                </span>
                <span className="status-row-value" style={{color}}>{shownValue} 例</span>
            </div>
            <Progress
                percent={percent}
                showInfo={false}
                strokeColor={color}
                trailColor="rgba(140,140,140,.14)"
                size={['100%', 8]}
            />
        </div>
    );
};

// 首屏骨架屏(结构与真实内容一致, 避免加载完成后的跳动)
const DashboardSkeleton = () => (
    <div className="dash-skeleton">
        <div className="kpi-grid">
            {Array.from({length: 6}).map((_, index) => (
                <Skeleton.Node key={index} active style={{width: '100%', height: 84}}/>
            ))}
        </div>
        <Skeleton active paragraph={{rows: 4}} title={false}/>
    </div>
);

// 新首页看板: 病例总数/随访情况/检查数量/诊断组分布/最近记录(数据按登录租户隔离)
export default () => {
    const navigate = useNavigate();
    const role = useAuthStore(state => state.role);
    const userInfo = useAuthStore(state => state.userInfo);
    const permissions = useAuthStore(state => state.permissions);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    // 随访日历: 计划日期(YYYY-MM-DD) -> 当日任务列表
    const [calendarTasks, setCalendarTasks] = useState({});
    // 日历当前选中日期(默认今天), 下方展示当日全部随访详情
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const loadStats = useCallback(() => {
        setLoading(true);
        return DashboardStats()
            .then(res => setStats(res?.data ?? {}))
            .catch(() => setStats(prev => prev ?? {}))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadStats();
        // 简化版随访日历: ±30天内的随访任务按计划日期分组
        DashboardCalendar().then(res => {
            const map = {};
            (res?.data ?? []).forEach(item => {
                if (!item?.planDate) return;
                const key = String(item.planDate).slice(0, 10);
                (map[key] = map[key] ?? []).push(item);
            });
            setCalendarTasks(map);
        }).catch(() => {});
    }, [loadStats]);

    // 权限判断: 平台管理员与旧会话放行, 避免跳转被路由守卫拦截
    const can = useCallback(
        code => role === 'platform' || !permissions?.length || permissions.includes(code),
        [permissions, role]
    );

    // 选中日期当天的随访任务
    const selectedTasks = useMemo(
        () => calendarTasks[selectedDate.format('YYYY-MM-DD')] ?? [],
        [calendarTasks, selectedDate],
    );

    // 快捷入口(按权限码过滤, 无权限则不展示)
    const quickLinks = useMemo(() => [
            {
                title: '研究对象',
                desc: '队列与基线信息',
                path: '/clinical/subject',
                permission: 'patient_queue:view',
                color: '#2db7f5',
                icon: <TeamOutlined/>,
            },
            {
                title: '随访任务',
                desc: '访视计划与执行',
                path: '/clinical/followUp',
                permission: 'follow_up:view',
                color: '#faad14',
                icon: <CalendarOutlined/>,
            },
            {
                title: '超声检查',
                desc: '超声数据录入',
                path: '/clinical/echo',
                permission: 'echo:view',
                color: '#722ed1',
                icon: <RadarChartOutlined/>,
            },
            {
                title: 'CMR 检查',
                desc: '心脏磁共振',
                path: '/clinical/cmr',
                permission: 'cmr:view',
                color: '#2f54eb',
                icon: <DotChartOutlined/>,
            },
        ].filter(link => can(link.permission)), [can]);

    const statCards = [
        {title: '研究对象总数', value: stats?.subjectTotal, icon: <TeamOutlined/>, color: '#2db7f5'},
        {title: '本月新增', value: stats?.subjectMonthNew, icon: <UserAddOutlined/>, color: '#52c41a'},
        {title: '待完成随访', value: stats?.followPending, icon: <CalendarOutlined/>, color: '#faad14'},
        {
            title: '逾期随访',
            value: stats?.followOverdue,
            icon: <FileDoneOutlined/>,
            color: '#ff4d4f',
            alert: (stats?.followOverdue ?? 0) > 0,
        },
        {title: '超声检查', value: stats?.echoTotal, icon: <RadarChartOutlined/>, color: '#722ed1'},
        {title: 'CMR 检查', value: stats?.cmrTotal, icon: <DotChartOutlined/>, color: '#2f54eb'},
    ];

    const followPending = stats?.followPending ?? 0;
    const followOverdue = stats?.followOverdue ?? 0;
    const followSituation = followPending + followOverdue;

    const hour = dayjs().hour();
    const greeting = hour < 6 ? '凌晨好' : hour < 11 ? '早上好' : hour < 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好';

    const followColumns = [
        {
            title: '研究对象',
            dataIndex: 'subjectName',
            render: v => v ?? '-',
        },
        {
            title: '随访类型',
            dataIndex: 'followupType',
            render: v => FOLLOW_TYPE[v] ?? '-',
        },
        {
            title: '计划日期',
            dataIndex: 'planDate',
            render: v => formatDate(v),
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: v => {
                const [label, color] = FOLLOW_STATUS[v] ?? ['未知', 'default'];
                return <Tag color={color}>{label}</Tag>;
            },
        },
    ];

    // 首次加载展示骨架屏, 后续刷新保留旧数据只做轻量 loading
    const firstLoading = loading && !stats;

    return (
        <div className={'dash'}>
            <Reveal className={'dash-hero'}>
                <div className="dash-hero-main">
                    <div className="dash-hero-greet">
                        {greeting}，{userInfo?.userName ?? '您好'}
                        <Tag className="dash-role-tag" color="blue">{ROLE_LABEL[role] ?? '用户'}</Tag>
                    </div>
                    <div className="dash-hero-sub">
                        {dayjs().format('YYYY年MM月DD日 dddd')} · 待完成随访 {followPending} 例
                        {followOverdue > 0 ? `，已逾期 ${followOverdue} 例` : ''}
                    </div>
                </div>
                <div className="dash-hero-actions">
                    <Tooltip title="刷新数据">
                        <Button
                            className="dash-refresh"
                            type="text"
                            icon={<ReloadOutlined/>}
                            loading={loading}
                            onClick={loadStats}
                        />
                    </Tooltip>
                </div>
                {quickLinks.length > 0 && (
                    <div className="dash-quick">
                        {quickLinks.map((link, index) => (
                            <button
                                key={link.path}
                                type="button"
                                className="quick-item"
                                style={{'--accent': link.color, '--i': index}}
                                onClick={() => navigate(link.path)}
                            >
                                <span className="quick-icon">{link.icon}</span>
                                <span className="quick-text">
                                    <span className="quick-title">{link.title}</span>
                                    <span className="quick-desc">{link.desc}</span>
                                </span>
                                <RightOutlined className="quick-arrow"/>
                            </button>
                        ))}
                    </div>
                )}
            </Reveal>

            {firstLoading ? <DashboardSkeleton/> : (
                <>
                    <div className="kpi-grid">
                        {statCards.map((card, index) => (
                            <KpiCard key={card.title} item={card} index={index}/>
                        ))}
                    </div>

                    <Row gutter={[12, 12]} align={'stretch'} className={'dash-row'}>
                        <Col xs={24} xl={9}>
                            <Reveal delay={60}>
                                <Card className="dash-card" variant="borderless" title="诊断组构成">
                                    <DiagnosisRing
                                        psCount={stats?.psCount ?? 0}
                                        paCount={stats?.paIvsCount ?? 0}
                                    />
                                </Card>
                            </Reveal>
                            <Reveal delay={140}>
                                <Card className="dash-card" variant="borderless" title="待处理随访">
                                    {followSituation > 0 ? (
                                        <>
                                            <StatusBar
                                                label="待完成"
                                                value={followPending}
                                                total={followSituation}
                                                color="#faad14"
                                            />
                                            <StatusBar
                                                label="已逾期"
                                                value={followOverdue}
                                                total={followSituation}
                                                color="#ff4d4f"
                                            />
                                            <div className="status-tip">
                                                共 {followSituation} 例随访需要跟进
                                            </div>
                                        </>
                                    ) : (
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无待处理随访"/>
                                    )}
                                </Card>
                            </Reveal>
                            <Reveal delay={200}>
                                <Card className="dash-card" variant="borderless" title="最近随访任务">
                                    <Table
                                        className="dash-table"
                                        size="small"
                                        rowKey={(r, i) => r?.id ?? i}
                                        pagination={false}
                                        scroll={{x: 'max-content'}}
                                        dataSource={stats?.recentFollowUps ?? []}
                                        columns={followColumns}
                                        locale={{
                                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                              description="暂无随访任务"/>,
                                        }}
                                    />
                                    {(stats?.recentFollowUps?.length ?? 0) > 0 && (
                                        <div className="dash-card-foot">
                                            仅展示最近 {stats.recentFollowUps.length} 条随访任务，
                                            {can('follow_up:view') ? (
                                                <span className="foot-link" onClick={() => navigate('/clinical/followUp')}>
                                                    查看全部
                                                </span>
                                            ) : '可在随访任务中查看全部'}
                                        </div>
                                    )}
                                </Card>
                            </Reveal>
                        </Col>
                        <Col xs={24} xl={15}>
                            <Reveal delay={100} className={'dash-reveal-fill'}>
                                <Card className="dash-card" variant="borderless" title="随访日历"
                                      styles={{body: {padding: '.4rem'}}}>
                                    <Calendar
                                        fullscreen={false}
                                        value={selectedDate}
                                        onSelect={setSelectedDate}
                                        headerRender={({value}) => (
                                            <div className="dash-cal-head">
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<LeftOutlined/>}
                                                    onClick={() => setSelectedDate(value.subtract(1, 'month'))}
                                                />
                                                <span className="dash-cal-title">{value.format('YYYY年MM月')}</span>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<RightOutlined/>}
                                                    onClick={() => setSelectedDate(value.add(1, 'month'))}
                                                />
                                            </div>
                                        )}
                                        dateCellRender={value => {
                                            const tasks = calendarTasks[value.format('YYYY-MM-DD')] ?? [];
                                            if (!tasks.length) return null;
                                            return (
                                                <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                                    {tasks.slice(0, 2).map((t, i) => (
                                                        <Tooltip key={i} title={`${t.subjectName ?? '未关联'} · ${FOLLOW_TYPE[t.followupType] ?? '随访'} · ${FOLLOW_STATUS[t.status]?.[0] ?? ''}`}>
                                                            <div style={{
                                                                fontSize: 11, lineHeight: '1.3', padding: '1px 4px',
                                                                borderRadius: 3, overflow: 'hidden', whiteSpace: 'nowrap',
                                                                textOverflow: 'ellipsis', color: '#fff',
                                                                background: FOLLOW_STATUS_COLOR[t.status] ?? '#999',
                                                            }}>
                                                                {t.subjectName ?? '未关联'} {FOLLOW_TYPE[t.followupType] ?? ''}
                                                            </div>
                                                        </Tooltip>
                                                    ))}
                                                    {tasks.length > 2 && (
                                                        <div style={{fontSize: 10, color: '#999', paddingLeft: 2}}>共{tasks.length}项</div>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    />
                                    {/* 选中日期当天的全部随访详情 */}
                                    <div className="follow-detail">
                                        <div className="follow-detail-head">
                                            当日随访详情 · {selectedDate.format('YYYY-MM-DD')}
                                            {selectedTasks.length > 0 && (
                                                <span className="follow-detail-count">共 {selectedTasks.length} 项</span>
                                            )}
                                        </div>
                                        {selectedTasks.length > 0 ? (
                                            <div className="follow-detail-list">
                                                {selectedTasks.map((t, i) => {
                                                    const [statusLabel, statusColor] = FOLLOW_STATUS[t.status] ?? ['未知', 'default'];
                                                    return (
                                                        <div className="follow-detail-item" key={t.id ?? i}>
                                                            <div className="follow-detail-item-head">
                                                                <span className="follow-detail-subject">
                                                                    {t.subjectName ?? '未关联研究对象'}
                                                                </span>
                                                                <Tag color={statusColor}>{statusLabel}</Tag>
                                                            </div>
                                                            <div className="follow-detail-item-body">
                                                                <span>随访类型：{FOLLOW_TYPE[t.followupType] ?? '-'}</span>
                                                                <span>计划日期：{formatDate(t.planDate)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="follow-detail-empty">当前日期无随访</div>
                                        )}
                                    </div>
                                </Card>
                            </Reveal>
                        </Col>
                    </Row>

                    <Reveal delay={120}>
                        <Card className="dash-card" variant="borderless" title="最近录入研究对象">
                            <Table
                                className="dash-table"
                                size="small"
                                rowKey={(r, i) => r?.subjectNo ?? i}
                                pagination={false}
                                scroll={{x: 'max-content'}}
                                dataSource={stats?.recentSubjects ?? []}
                                locale={{
                                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                      description="暂无研究对象"/>,
                                }}
                                columns={[
                                    {title: '研究编号', dataIndex: 'subjectNo', render: v => v ?? '-'},
                                    {title: '患儿姓名', dataIndex: 'name', render: v => v ?? '-'},
                                    {
                                        title: '诊断组', dataIndex: 'diagnosisGroup',
                                        render: v => v === 1 ? <Tag color="blue">PS</Tag> : v === 2 ?
                                            <Tag color="purple">PA_IVS</Tag> : '-',
                                    },
                                    {
                                        title: '录入时间', dataIndex: 'createDate',
                                        render: v => formatDate(v),
                                    },
                                ]}
                            />
                        </Card>
                    </Reveal>
                </>
            )}
        </div>
    );
};
