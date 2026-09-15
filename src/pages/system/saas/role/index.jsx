import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import RoleEditModal from "@/pages/system/saas/role/components/RoleEditModal/index.jsx";
import RolePermissionModal from "@/pages/system/saas/role/components/RolePermissionModal/index.jsx";
import {RoleDel, RolePage, RoleSaveOrEdit, RoleSavePermissions, TenantList} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";
import {useRef, useState} from "react";
import {Button, message} from "antd";

export default () => {
    const [searchTenantId, setSearchTenantId] = useState(undefined);
    const [searchRoleName, setSearchRoleName] = useState(undefined);
    const [searchStatus, setSearchStatus] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: '所属租户',
            dataIndex: 'tenantName',
            key: 'tenantName',
            render(value) {
                return value ?? '平台级'
            }
        },
        {
            title: '角色类型',
            dataIndex: 'roleType',
            key: 'roleType',
            render(value) {
                const findItem = Constant.RoleTypeOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '数据范围',
            dataIndex: 'dataScope',
            key: 'dataScope',
            render(value) {
                const findItem = Constant.DataScopeOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render(value) {
                const findItem = Constant.StartCloseOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(_, row) {
                return <TableActionButtons>
                    <Button type={'link'} onClick={() => openModal(row)}>编辑</Button>
                    <Button type={'link'} onClick={() => permissionModalRef.current?.open(row)}>配置权限</Button>
                    <BasePopconfirm onConfirm={() => submitDel(row)}/>
                </TableActionButtons>;
            }
        }
    ]

    const onSearch = () => tableRef.current?.initPageSearch();
    const onReset = () => {
        setSearchTenantId(undefined);
        setSearchRoleName(undefined);
        setSearchStatus(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitDel = data => {
        return RoleDel({id: data.id}).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }

    const baseFormRef = useRef();
    const [formData, setFormData] = useState({});
    const openModal = (data = {}) => {
        baseFormRef.current?.open({
            id: data.id,
            tenantId: data.tenantId,
            roleCode: data.roleCode,
            roleName: data.roleName,
            roleType: data.roleType ?? 2,
            dataScope: data.dataScope ?? 1,
            description: data.description,
            sortOrder: data.sortOrder ?? 0,
            status: data.status === undefined ? 1 : data.status,
        })
    }
    const submitForm = (data) => {
        return RoleSaveOrEdit(data).then(res => {
            message.success(res.data)
            baseFormRef.current?.close()
            tableRef.current?.getTableData()
        })
    }

    // 独立配置角色权限
    const permissionModalRef = useRef();
    const submitPermissions = (row, permissionIds) => {
        return RoleSavePermissions({id: row.id, permissionIds}).then(res => {
            message.success(res.data)
            permissionModalRef.current?.close()
        })
    }

    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'所属租户'}>
                    <BaseAntdSelect
                        value={searchTenantId}
                        setValue={setSearchTenantId}
                        style={{width: '15rem'}}
                        api={TenantList}
                        labelName={'tenantName'}
                        valueName={'id'}
                    />
                </SearchRow.Item>
                <SearchRow.Item title={'角色名称'}>
                    <BaseAntdInput value={searchRoleName} setValue={setSearchRoleName}/>
                </SearchRow.Item>
                <SearchRow.Item title={'状态'}>
                    <BaseAntdSelect
                        value={searchStatus}
                        setValue={setSearchStatus}
                        style={{width: '10rem'}}
                        data={Constant.StartCloseOptions}
                    />
                </SearchRow.Item>
                <SearchRow.Item>
                    <SearchBtnGroup
                        onSearch={onSearch}
                        onReset={onReset}
                        onAdd={openModal}
                    />
                </SearchRow.Item>
            </SearchRow>
            <BaseAntdTable
                api={RolePage}
                apiData={{
                    tenantId: searchTenantId,
                    roleName: searchRoleName,
                    status: searchStatus,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  角色编辑弹窗  */}
            <RoleEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
            {/*  角色权限独立配置弹窗  */}
            <RolePermissionModal
                ref={permissionModalRef}
                onSubmit={submitPermissions}
            />
        </>
    )
}
