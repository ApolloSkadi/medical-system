import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {useEffect, useRef, useState} from "react";
import CopyText from "@/component/CopyText/index.jsx";
import {PatientPage} from "@/api/system/patient/index.js";
import PatientEditModal from "@/pages/system/patient/components/PatientEditModal/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {Button} from "antd";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import { FAntdInput } from 'izid'

export default () => {
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
                </TableActionButtons>
            }

        }
    ]

    const baseFormRef = useRef()
    const [formData, setFormData] = useState({})
    const openPatientModal = (row = {}) => {
        baseFormRef.current?.open(row)
    }
    const submitForm = () => {

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
            <PatientEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
            />
        </>
    );
};
