import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {useRef, useState} from "react";
import CopyText from "@/component/CopyText/index.jsx";
import {PatientPage} from "@/api/system/patient/index.js";
import {UserPage} from "@/api/system/user/index.js";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {Button} from "antd";

export default () => {
    // 接口查询参数
    const [userName, setUserName] = useState();
    // 用户列表相关
    const tableRef = useRef();
    const columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title:'用户类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title:'状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(_,row){
                return <TableActionButtons>
                    <Button type={'link'} >修改密码</Button>
                    { row?.status === 1 ?
                        <Button type={'link'} >关闭</Button> :
                        <Button type={'link'} >开启</Button>
                    }
                </TableActionButtons>
            }
        },
    ]


    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'用户姓名'}>
                    <BaseAntdInput
                        value={userName}
                        setValue={setUserName}
                    />
                </SearchRow.Item>
            </SearchRow>
            <BaseAntdTable
                api={UserPage}
                apiData={{
                    name: userName,
                }}
                ref={tableRef}
                columns={columns}
            />
        </>
    );
};
