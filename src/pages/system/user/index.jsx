import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {useRef, useState} from "react";
import CopyText from "@/component/CopyText/index.jsx";
import {PatientPage} from "@/api/system/patient/index.js";

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
    ]


    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'用户姓名'}>
                    <BaseAntdInput
                        value={patientName}
                        setValue={setPatientName}
                    />
                </SearchRow.Item>
            </SearchRow>
            <BaseAntdTable
                api={PatientPage}
                apiData={{
                    name: patientName,
                }}
                ref={tableRef}
                columns={columns}
            />
        </>
    );
};
