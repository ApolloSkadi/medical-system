import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import CopyText from "@/component/CopyText/index.jsx";
import {PatientPage} from "@/api/system/patient/index.js";
import PatientEditModal from "@/pages/system/patient/components/PatientEditModal/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {Button} from "antd";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import { FAntdInput } from 'izid'
import {EyeOutlined} from "@ant-design/icons";

export default () => {
    const navigate = useNavigate();
    // 接口查询参数
    const [patientName, setPatientName] = useState();
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
            dataIndex: 'phone',
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
                    <Button type={'link'} icon={<EyeOutlined />} onClick={() => handleViewDetail(row)}>
                        详情
                    </Button>
                </TableActionButtons>
            }

        }
    ]
    // 病人编辑弹窗
    const baseFormRef = useRef()
    const [formData, setFormData] = useState()
    const openPatientModal = (row = {}) => {
        baseFormRef.current?.open(row)
    }
    const submitForm = (formValues) => {
        console.log('表单信息', formValues)
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
            </SearchRow>
            <SearchRow>
                <SearchBtnGroup
                    onAdd={openPatientModal}
                />
            </SearchRow>
            <BaseAntdTable
                api={PatientPage}
                apiData={{
                    name: patientName,
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
