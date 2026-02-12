import SearchRow from "@/component/SearchRow/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {useRef, useState} from "react";
import {CreateUserInfo, EditUser, UserPage} from "@/api/system/user/index.js";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {Button, message, Modal, Tag} from "antd";
import {FAntdInput} from "izid/dist/index.modern.mjs";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import UserCreateModal from "@/pages/system/user/components/UserCreateModal";
import PwdChangeModal from "@/layout/header/components/PwdChangeModal";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import {ExclamationCircleFilled} from "@ant-design/icons";

export default () => {
    // 接口查询参数
    const [userName, setUserName] = useState();
    const [phone, setPhone] =useState();
    const [userType, setUserType] = useState();
    // 用户列表相关
    const tableRef = useRef();
    const columns = [
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName',
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
            render(value) {
                if (value === 0) return <Tag color="blue">普通用户</Tag>
                if (value === 1) return <Tag color="green">管理员</Tag>
                return <Tag>未知</Tag>;
            }
        },
        {
            title:'状态',
            dataIndex: 'status',
            key: 'status',
            render(value) {
                const findItem = Constant.OpenCloseOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(_,row){
                return <TableActionButtons>
                    <Button type={'link'} onClick={() => changePwdRef.current?.open({
                        id: row.id
                    })}>修改密码</Button>
                    { row?.status === 1 ?
                        <Button type={'link'} onClick={() => changeUser(row, 0)}>封禁</Button> :
                        <Button type={'link'} onClick={() => changeUser(row, 1)}>开启</Button>
                    }
                </TableActionButtons>
            }
        },
    ]
    const onSearch = () => tableRef.current?.initPageSearch();
    const onReset = () => {
        setUserName(undefined);
        setPhone(undefined);
        setUserType(undefined);
        return tableRef.current?.resetPageSearch();
    }
    // 用户弹窗
    const createFormRef = useRef();
    const [createForm, setCreateForm] = useState();
    const openCreateModal = (row = {}) => {
        createFormRef.current?.open(row)
    }
    const createSubmit = (data) => {
        return CreateUserInfo({
            userName: data.userName,
            phone: data.phone,
            realName: data.realName,
            gender: data.gender,
            sourcePwd: data.sourcePwd,
            type: data.accountType,
        }).then(res => {
            message.success(res.data)
            createFormRef.current?.close()
            tableRef.current?.initPageSearch();
        })
    }
    // 修改密码
    const changePwdRef = useRef();
    const [changePwdForm, setChangePwdForm] = useState();
    // 修改密码方法
    const pwdSubmit = (data) => {
        return EditUser(data).then((res)=>{
            message.success(res.data)
        })
    }
    // 开关账户
    const changeUser = (data, type) => {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title:`是否${type === 1 ? '开启' : '封禁'}用户${data.userName}`,
                icon: <ExclamationCircleFilled />,
                onOk() {
                    resolve(EditUser({
                        id: data.id,
                        status: type
                    }).then((res)=>{
                        message.success(res.data)
                        tableRef.current?.initPageSearch();
                    }))
                },
                onCancel() {
                    reject(new Error('取消提交'))
                }
            })
        })
    }

    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'用户姓名'}>
                    <BaseAntdInput
                        value={userName}
                        setValue={setUserName}
                    />
                </SearchRow.Item>
                <SearchRow.Item title={'手机号'}>
                    <FAntdInput state={[phone, setPhone]} />
                </SearchRow.Item>
                <SearchRow.Item title={'用户类型'}>
                    <BaseAntdSelect
                        value={userType}
                        setValue={setUserType}
                        style={{width: '18rem'}}
                        data={Constant.UserTypeOptions}
                    />
                </SearchRow.Item>
                <SearchRow.Item>
                    <SearchBtnGroup
                        onSearch={onSearch}
                        onReset={onReset}
                        onAdd={openCreateModal}
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
            {/* 创建用户 */}
            <UserCreateModal
                ref={createFormRef}
                formData={createForm}
                setFormData={setCreateForm}
                onSubmit={createSubmit}
            />
            {/*  修改密码  */}
            <PwdChangeModal
                ref={changePwdRef}
                formData={changePwdForm}
                setFormData={setChangePwdForm}
                onSubmit={pwdSubmit}
            />
        </>
    );
};
