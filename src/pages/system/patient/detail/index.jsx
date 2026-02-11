import {use, useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Descriptions, Card, Divider, Breadcrumb, Button, Spin, message, Row, Col, Flex} from "antd";
import {
    EyeOutlined,
    HomeOutlined,
    PlusOutlined,
    RedoOutlined,
    ReloadOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import { PatientPage } from "@/api/system/patient/index.js";
import { PatientDetail } from "@/api/system/patient/index.js";
import { set } from "lodash-es";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {FollowPage, FollowSaveOrEdit} from "@/api/system/follow/index.js";
import FollowEditModal from "@/pages/system/patient/components/FollowEditModal/index.jsx";
import dayjs from "dayjs";
import SearchRow from "@/component/SearchRow/index.jsx";

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
        navigate('/patient');
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

    // 随访记录列表
    const tableRef = useRef();
    const columns = [
        {
            title: '随访类型',
            dataIndex: 'followupType',
            render(value) {

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
            title: '操作',
            dataIndex: 'active',
            render(_, row) {
                return <TableActionButtons>
                    <Button type={'link'} onClick={() =>openFollowModal(row)}>
                        编辑
                    </Button>
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
        return FollowSaveOrEdit(data).then(res => {
            message.success(res.data);
            baseFormRef.current?.close()
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
                    返回列表
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
                    <Descriptions.Item label="手术日龄">{data?.surgeryAge || '-'}</Descriptions.Item>
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
                    </Descriptions>
                </Card>

                <Divider />

                {/* 病史信息 */}
                <Descriptions
                    title="病史信息"
                    bordered
                    column={3}
                    size="small"
                >
                    <Descriptions.Item label="过敏史">{formatSwitch(data?.allergyHistory)}</Descriptions.Item>
                    <Descriptions.Item label="既往病史">{formatSwitch(data?.medicalHistory)}</Descriptions.Item>
                    <Descriptions.Item label="金属植入史">{formatSwitch(data?.metalImplantHistory)}</Descriptions.Item>
                </Descriptions>

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
                data={formData}
                setData={setFormData}
                onSubmit={submitForm}
            />
        </div>
    );
};
