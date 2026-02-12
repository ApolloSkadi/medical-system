import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import CopyText from "@/component/CopyText/index.jsx";
import {PatientDel, PatientPage, PatientSaveOrEdit} from "@/api/system/patient/index.js";
import PatientEditModal from "@/pages/system/patient/components/PatientEditModal/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {Button, message} from "antd";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import { FAntdInput } from 'izid'
import {DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";

export default () => {
    const navigate = useNavigate();
    // 接口查询参数
    const [patientName, setPatientName] = useState();
    const [searchNo, setSearchNo] = useState();
    const [phone, setPhone] = useState();
    // 病人列表相关
    const tableRef = useRef();
    const columns = [
        {
            title: '患者姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title:'门诊号',
            dataIndex: 'outpatientNo',
            key: 'outpatientNo',
            render(value) {
                return <CopyText>{value}</CopyText>
            }
        },
        {
            title:'住院号',
            dataIndex: 'inpatientNo',
            key: 'inpatientNo',
            render(value) {
                return <CopyText>{value}</CopyText>
            }
        },
        {
            title:'基线检查日期',
            dataIndex: 'baseCheckDate',
            key: 'baseCheckDate',
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            render(value) {
                return <CopyText>{value}</CopyText>;
            }
        },
        {
            title:'操作',
            dataIndex: 'active',
            render(_,row){
                return <TableActionButtons>
                    <Button type={'link'} onClick={() => openPatientModal(row)}>
                        编辑
                    </Button>
                    <Button
                        type={'link'}
                        iconPosition="end"
                        icon={<EyeOutlined style={{marginLeft: '-.5rem'}}/>}
                        onClick={() => handleViewDetail(row)}>
                        详情
                    </Button>
                    <BasePopconfirm onConfirm={() => submitDel(row)} />
                </TableActionButtons>
            }

        }
    ]
    const onSearch = () => tableRef.current?.initPageSearch();
    const toReset = () => {
        setPatientName(undefined);
        setSearchNo(undefined);
        setPhone(undefined);
        return tableRef.current?.resetPageSearch();
    }
    // 病人编辑弹窗
    const baseFormRef = useRef()
    const [formData, setFormData] = useState()
    const openPatientModal = (row = {}) => {
        baseFormRef.current?.open({
            ...row,
            birthDate: row?.birthDate ? dayjs(row?.birthDate) : undefined,
            baseCheckDate: row?.baseCheckDate ? dayjs(row?.baseCheckDate) : undefined,
        })
    }
    const submitForm = (formValues) => {
        return PatientSaveOrEdit(formValues).then(res => {
            message.success(res.data)
            baseFormRef.current?.close()
            tableRef.current?.getTableData();
        })
    }
    // 删除病人信息
    const submitDel = data => {
        return PatientDel(data).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }
    // 跳转到详情页
    const handleViewDetail = (row) => {
        navigate(`/patient/detail/${row.id}`);
    }
    
    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'患者姓名'}>
                    <FAntdInput state={[patientName, setPatientName]} />
                </SearchRow.Item>
                <SearchRow.Item title={'门诊号/住院号'}>
                    <FAntdInput state={[searchNo, setSearchNo]} />
                </SearchRow.Item>
                <SearchRow.Item title={'电话'}>
                    <FAntdInput state={[phone, setPhone]} />
                </SearchRow.Item>
                <SearchRow.Item>
                    <SearchBtnGroup
                        onSearch={onSearch}
                        onReset={toReset}
                        onAdd={openPatientModal}
                    />
                </SearchRow.Item>
            </SearchRow>
            <BaseAntdTable
                api={PatientPage}
                apiData={{
                    name: patientName,
                    searchNo: searchNo,
                    phone: phone,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/* 编辑病人信息 */}
            <PatientEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    );
};
