import {useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Descriptions, Card, Divider, Breadcrumb, Button, Spin, message, Row, Col, Flex} from "antd";
import {
    HomeOutlined,
    PlusOutlined,
    ReloadOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import { PatientDetail } from "@/api/system/patient/index.js";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {FollowDelete, FollowPage, FollowSaveOrEdit} from "@/api/system/follow/index.js";
import FollowEditModal from "@/pages/system/patient/components/FollowEditModal/index.jsx";
import dayjs from "dayjs";
import Constant from "@/utils/Constant.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import {SurgeryDelete, SurgeryPage, SurgerySaveOrEdit} from "@/api/system/surgery/index.js";
import SurgeryEditModal from "@/pages/system/patient/components/SurgeryEditModal/index.jsx";

export default () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    // 获取患者详情数据
    useEffect(() => {
        if (id) {
            fetchPatientDetail();
        }
    }, [id]);

    const fetchPatientDetail = () => {
        setLoading(true);
        PatientDetail({id}).then(res => {
            setData(res.data);
        }).finally(() => {
            setLoading(false);
        })
    };

    // 返回列表页
    const handleBack = () => {
        navigate(-1);
    };

    // 格式化日期显示
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        if (typeof dateStr === 'string') return dateStr.split('T')[0];
        return dateStr;
    };

    // 格式化开关值显示
    const formatSwitch = (value) => {
        if (value === true || value === 1 || value === '1') return '有';
        if (value === false || value === 0 || value === '0') return '无';
        return '无';
    };
    const formatYesNo = (value) => {
        if (value === true || value === 1 || value === '1') return '是';
        if (value === false || value === 0 || value === '0') return '否';
        return '否';
    };
    const formatProductMode = (value) => {
        if (value === 1 || value === '1') return '顺产';
        if (value === 2 || value === '2') return '剖腹产';
        return '-';
    };
    const formatValue = value => (value === undefined || value === null || value === '') ? '-' : value;

    // 随访记录列表
    const tableRef = useRef();
    const columns = [
        {
            title: '随访类型',
            dataIndex: 'followupType',
            render(value) {
                const findItem = Constant.FollowTypeOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '随访体重',
            dataIndex: 'followupWeight',
            key: 'followupWeight',
        },
        {
            title:'预计随访时间',
            dataIndex: 'expectedFollowupDate',
            key: 'expectedFollowupDate',
        },
        {
            title:'实际随访时间',
            dataIndex: 'actualFollowupDate',
            key: 'actualFollowupDate',
        },
        {
            title: '方案偏离',
            dataIndex: 'protocolDeviation',
            key: 'protocolDeviation',
            render: formatYesNo
        },
        {
            title: '不良事件',
            dataIndex: 'adverseEvent',
            key: 'adverseEvent',
            render: formatYesNo
        },
        {
            title: '操作',
            dataIndex: 'active',
            render(_, row) {
                return <TableActionButtons>
                    <Button type={'link'} onClick={() =>openFollowModal(row)}>
                        编辑
                    </Button>
                    <BasePopconfirm onConfirm={() => submitDel(row)} />
                </TableActionButtons>
            }
        }
    ]
    // 随访记录弹窗
    const baseFormRef = useRef()
    const [formData, setFormData] = useState()
    const openFollowModal = (row= {}) => {
        baseFormRef.current?.open({
            ...row,
            actualFollowupDate: row?.actualFollowupDate ? dayjs(row?.actualFollowupDate) : undefined,
            expectedFollowupDate: row?.expectedFollowupDate ? dayjs(row.expectedFollowupDate) : undefined,
        })
    }
    const submitForm = (data) => {
        const submitData = {
            id: data.id,
            patientId: data.patientId || id,
            name: data.name,
            followupType: data.followupType,
            followupWeight: data.followupWeight,
            followupHeight: data.followupHeight,
            mainDiagnosis: data.mainDiagnosis,
            secondDiagnosis: data.secondDiagnosis,
            expectedFollowupDate: data.expectedFollowupDate ? dayjs(data.expectedFollowupDate).format('YYYY-MM-DD') : undefined,
            actualFollowupDate: data.actualFollowupDate ? dayjs(data.actualFollowupDate).format('YYYY-MM-DD') : undefined,
            followupCheckResult: data.followupCheckResult,
            followupEchoRvEda: data.followupEchoRvEda,
            followupEchoRvEsa: data.followupEchoRvEsa,
            followupEchoRvFac: data.followupEchoRvFac,
            followupEchoTapse: data.followupEchoTapse,
            followupEchoRvLongDiameter: data.followupEchoRvLongDiameter,
            followupEchoRvTransverseDiameter: data.followupEchoRvTransverseDiameter,
            followupEchoTdiRvS: data.followupEchoTdiRvS,
            followupEchoTdiRvE: data.followupEchoTdiRvE,
            followupEchoTdiRvA: data.followupEchoTdiRvA,
            followupEchoTvE: data.followupEchoTvE,
            followupEchoTvA: data.followupEchoTvA,
            followupEchoTrVelocity: data.followupEchoTrVelocity,
            followupEchoMpaVelocity: data.followupEchoMpaVelocity,
            followupTricuspidAnnulus: data.followupTricuspidAnnulus,
            checkMriEcv: data.checkMriEcv,
            checkMriHct: data.checkMriHct,
            checkMriRightPost: data.checkMriRightPost,
            checkMriRightNative: data.checkMriRightNative,
            checkMriBloodPost: data.checkMriBloodPost,
            checkMriBloodNative: data.checkMriBloodNative,
            checkMriRvedv: data.checkMriRvedv,
            checkMriRvesv: data.checkMriRvesv,
            checkMriRvef: data.checkMriRvef,
            protocolDeviation: data.protocolDeviation ?? false,
            protocolDeviationDetail: data.protocolDeviationDetail,
            adverseEvent: data.adverseEvent ?? false,
            adverseEventDetail: data.adverseEventDetail,
            remark: data.remark,
            status: data.status,
            medication: data.medication ?? false,
            medicationDetail: data.medicationDetail,
            bloodPotassium: data.bloodPotassium
        };
        return FollowSaveOrEdit(submitData).then(res => {
            message.success(res.data);
            baseFormRef.current?.close()
            tableRef.current?.getTableData();
        })
    }

    // 手术记录列表
    const surgeryTableRef = useRef();
    const surgeryFormRef = useRef();
    const [surgeryFormData, setSurgeryFormData] = useState();
    const surgeryColumns = [
        {
            title: '手术日龄(日)',
            dataIndex: 'surgeryAge',
            key: 'surgeryAge',
        },
        {
            title: '肺动脉瓣环',
            dataIndex: 'pulmonaryValveAnnulus',
            key: 'pulmonaryValveAnnulus',
        },
        {
            title: '球囊长度',
            dataIndex: 'balloonLength',
            key: 'balloonLength',
        },
        {
            title: '球囊宽度',
            dataIndex: 'balloonWidth',
            key: 'balloonWidth',
        },
        {
            title: '球囊扩张次数',
            dataIndex: 'balloonDilationCounts',
            key: 'balloonDilationCounts',
        },
        {
            title: '跨瓣压差',
            dataIndex: 'transvalvularPressureGradient',
            key: 'transvalvularPressureGradient',
        },
        {
            title: '操作',
            dataIndex: 'active',
            render(_, row) {
                return <TableActionButtons>
                    <Button type={'link'} onClick={() => openSurgeryModal(row)}>
                        编辑
                    </Button>
                    <BasePopconfirm onConfirm={() => submitSurgeryDel(row)} />
                </TableActionButtons>
            }
        }
    ];
    const openSurgeryModal = (row = {}) => {
        surgeryFormRef.current?.open({
            patientId: id,
            ...row,
        })
    }
    const submitSurgeryForm = (data) => {
        const submitData = {
            id: data.id,
            patientId: data.patientId || id,
            surgeryAge: data.surgeryAge,
            befRightSystolicPressure: data.befRightSystolicPressure,
            befRightDiastolicPressure: data.befRightDiastolicPressure,
            befRightAveragePressure: data.befRightAveragePressure,
            pulmonaryValveAnnulus: data.pulmonaryValveAnnulus,
            balloonLength: data.balloonLength,
            balloonWidth: data.balloonWidth,
            balloonDilationCounts: data.balloonDilationCounts,
            aftRightSystolicPressure: data.aftRightSystolicPressure,
            pulmonaryPressure: data.pulmonaryPressure,
            transvalvularPressureGradient: data.transvalvularPressureGradient,
        };
        return SurgerySaveOrEdit(submitData).then(res => {
            message.success(res.data);
            surgeryFormRef.current?.close();
            surgeryTableRef.current?.getTableData();
        })
    }
    const submitSurgeryDel = data => {
        return SurgeryDelete(data).then(res => {
            message.success(res.data);
            surgeryTableRef.current?.getTableData();
        })
    }
    // 删除随访
    const submitDel = data => {
        return FollowDelete(data).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }

    return (
        <div className="p-4">
            {/* 面包屑导航 */}
            <Breadcrumb
                items={[
                    {
                        href: '/dashboard',
                        title: <><HomeOutlined /> 首页</>,
                    },
                    {
                        href: '/patient',
                        title: <><TeamOutlined /> 患者管理</>,
                    },
                    {
                        title: <><UserOutlined /> 患者详情</>,
                    },
                ]}
                className="mb-4"
            />
            <Flex justify={'flex-end'} align={'center'} className="mb-4">
                {/*/!* 返回按钮 *!/*/}
                <Button
                    type="primary"
                    onClick={handleBack}
                    className="mb-4"
                >
                    返回
                </Button>
            </Flex>
            <Spin spinning={loading}>
                {/* 基本信息 */}
                <Descriptions
                    title="基本信息"
                    bordered
                    column={2}
                    size="small"
                    className="mb-4"
                >
                    <Descriptions.Item label="患者姓名">{data?.name || '-'}</Descriptions.Item>
                    <Descriptions.Item label="性别">{data?.gender || '-'}</Descriptions.Item>
                    <Descriptions.Item label="出生体重(kg)">{data?.birthWeight || '-'}</Descriptions.Item>
                    <Descriptions.Item label="胎龄(周)">{data?.gestationalAge || '-'}</Descriptions.Item>
                    <Descriptions.Item label="门诊号">{data?.outpatientNo || '-'}</Descriptions.Item>
                    <Descriptions.Item label="住院号">{data?.inpatientNo || '-'}</Descriptions.Item>
                    <Descriptions.Item label="出生日期">{formatDate(data?.birthDate)}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{data?.phone || '-'}</Descriptions.Item>
                </Descriptions>

                <Divider />

                {/* 诊断信息 */}
                <Descriptions
                    title="诊断信息"
                    bordered
                    column={1}
                    size="small"
                    className="mb-4"
                    layout="vertical"
                >
                    <Descriptions.Item label="主要诊断" >{data?.mainDiagnosis || '-'}</Descriptions.Item>
                    <Descriptions.Item label="次要诊断" >{data?.secondDiagnosis || '-'}</Descriptions.Item>
                </Descriptions>

                <Divider />

                {/* 基线检查 */}
                <Descriptions
                    title="基线检查"
                    bordered
                    column={2}
                    size="small"
                    className="mb-4"
                >
                    <Descriptions.Item label="基线检查日期">{formatDate(data?.baseCheckDate)}</Descriptions.Item>
                    <Descriptions.Item label="基线检查心超结果" span={2}>{data?.baseCheckResult || '-'}</Descriptions.Item>
                </Descriptions>

                <Divider />

                {/* 心脏超声检查 */}
                <Card title="心脏超声检查" size="small" className="mb-4">
                    <Descriptions bordered column={3} size="small">
                        <Descriptions.Item label="RV-FAC(%)">{formatValue(data?.baseEchoRvFac)}</Descriptions.Item>
                        <Descriptions.Item label="RV-EDA(cm²)">{formatValue(data?.baseEchoRvEda)}</Descriptions.Item>
                        <Descriptions.Item label="RV-ESA(cm²)">{formatValue(data?.baseEchoRvEsa)}</Descriptions.Item>
                        <Descriptions.Item label="TAPSE(cm)">{formatValue(data?.baseEchoTapse)}</Descriptions.Item>
                        <Descriptions.Item label="右心室长径(mm)">{formatValue(data?.baseEchoRvLongDiameter)}</Descriptions.Item>
                        <Descriptions.Item label="右心室横径(mm)">{formatValue(data?.baseEchoRvTransverseDiameter)}</Descriptions.Item>
                        <Descriptions.Item label="TDI-RV-S(cm/s)">{formatValue(data?.baseEchoTdiRvS)}</Descriptions.Item>
                        <Descriptions.Item label="TDI-RV-E'(cm/s)">{formatValue(data?.baseEchoTdiRvE)}</Descriptions.Item>
                        <Descriptions.Item label="TDI-RV-A'(cm/s)">{formatValue(data?.baseEchoTdiRvA)}</Descriptions.Item>
                        <Descriptions.Item label="TV-E(m/s)">{formatValue(data?.baseEchoTvE)}</Descriptions.Item>
                        <Descriptions.Item label="TV-A(m/s)">{formatValue(data?.baseEchoTvA)}</Descriptions.Item>
                        <Descriptions.Item label="TR流速(m/s)">{formatValue(data?.baseEchoTrVelocity)}</Descriptions.Item>
                        <Descriptions.Item label="MPA流速(m/s)">{formatValue(data?.baseEchoMpaVelocity)}</Descriptions.Item>
                        <Descriptions.Item label="三尖瓣瓣环(mm)">{formatValue(data?.baseTricuspidAnnulus)}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Divider />

                {/* 磁共振记录 */}
                <Card title="磁共振记录" size="small" className="mb-4">
                    <Descriptions
                        bordered
                        column={2}
                        size="small"
                    >
                        <Descriptions.Item label="右心室T1 post">{data?.checkMriRightPost || '-'}</Descriptions.Item>
                        <Descriptions.Item label="右心室T1 native">{data?.checkMriRightNative || '-'}</Descriptions.Item>
                        <Descriptions.Item label="血池T1 post">{data?.checkMriBloodPost || '-'}</Descriptions.Item>
                        <Descriptions.Item label="血池T1 native">{data?.checkMriBloodNative || '-'}</Descriptions.Item>
                        <Descriptions.Item label="HCT">{data?.checkMriHct || '-'}</Descriptions.Item>
                        <Descriptions.Item label="ECV">{data?.checkMriEcv || '-'}</Descriptions.Item>
                        <Descriptions.Item label="RVEDV(ml)">{formatValue(data?.checkMriRvedv)}</Descriptions.Item>
                        <Descriptions.Item label="RVESV(ml)">{formatValue(data?.checkMriRvesv)}</Descriptions.Item>
                        <Descriptions.Item label="RVEF(%)">{formatValue(data?.checkMriRvef)}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Divider />

                {/* 病史信息 */}
                <Descriptions
                    title="病史信息"
                    bordered
                    column={4}
                    size="small"
                >
                    <Descriptions.Item label="血钾(mmol/L)">{formatValue(data?.bloodPotassium)}</Descriptions.Item>
                    <Descriptions.Item label="过敏史">{formatSwitch(data?.allergyHistory)}</Descriptions.Item>
                    <Descriptions.Item label="是否二次手术">{formatYesNo(data?.isDoubleSurgery)}</Descriptions.Item>
                    <Descriptions.Item label="是否RCT">{formatYesNo(data?.isRct)}</Descriptions.Item>
                    <Descriptions.Item label="家族史">{formatSwitch(data?.familyHistory)}</Descriptions.Item>
                    <Descriptions.Item label="孕产次G">{formatValue(data?.gravidityTime)}</Descriptions.Item>
                    <Descriptions.Item label="孕产次P">{formatValue(data?.gravidityPTime)}</Descriptions.Item>
                    <Descriptions.Item label="生产方式">{formatProductMode(data?.productMode)}</Descriptions.Item>
                    <Descriptions.Item label="用药/干预措施">{formatSwitch(data?.medication)}</Descriptions.Item>
                    <Descriptions.Item label="用药/干预措施详情" span={4}>{formatValue(data?.medicationDetail)}</Descriptions.Item>
                </Descriptions>

                <Divider />

                {/* 手术记录列表 */}
                <Card title="手术记录" size="small" className="mb-4">
                    <Flex justify={'flex-end'} align={'center'} className="mb-4">
                        <Button className="mr-2" icon={<ReloadOutlined />} onClick={() => surgeryTableRef.current?.initPageSearch()}>刷新</Button>
                        <Button type={'primary'} icon={<PlusOutlined />} onClick={() => openSurgeryModal({
                            patientId: id,
                        })}>新增</Button>
                    </Flex>
                    <BaseAntdTable
                        api={SurgeryPage}
                        apiData={{
                            patientId: id
                        }}
                        ref={surgeryTableRef}
                        columns={surgeryColumns}
                    />
                </Card>

                <Divider />

                {/* 随访记录列表 */}
                <Card title="随访记录" size="small" className="mb-4">
                    <Flex justify={'flex-end'} align={'center'} className="mb-4">
                        <Button className="mr-2" icon={<ReloadOutlined />} onClick={() => tableRef.current?.initPageSearch()}>刷新</Button>
                        <Button type={'primary'} icon={<PlusOutlined />} onClick={() => openFollowModal({
                            patientId: id
                        })}>新增</Button>
                    </Flex>
                    <BaseAntdTable
                        api={FollowPage}
                        apiData={{
                            patientId: id
                        }}
                        ref={tableRef}
                        columns={columns}
                    />
                </Card>
            </Spin>
            {/*  随访弹窗  */}
            <FollowEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
            {/*  手术记录弹窗  */}
            <SurgeryEditModal
                ref={surgeryFormRef}
                formData={surgeryFormData}
                setFormData={setSurgeryFormData}
                onSubmit={submitSurgeryForm}
            />
        </div>
    );
};
