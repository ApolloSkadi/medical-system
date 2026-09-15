import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import PermissionEditModal from "@/pages/system/saas/permission/components/PermissionEditModal/index.jsx";
import {PermissionDel, PermissionPage, PermissionSaveOrEdit} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";
import {useRef, useState} from "react";
import {Button, message} from "antd";

export default () => {
    const [searchModuleCode, setSearchModuleCode] = useState(undefined);
    const [searchName, setSearchName] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '权限编码',
            dataIndex: 'permissionCode',
            key: 'permissionCode',
        },
        {
            title: '权限名称',
            dataIndex: 'permissionName',
            key: 'permissionName',
        },
        {
            title: '所属模块',
            dataIndex: 'moduleCode',
            key: 'moduleCode',
            render(value) {
                const findItem = Constant.ModuleOptions.find(v => v.value === value);
                return findItem?.label ?? value ?? '-'
            }
        },
        {
            title: '操作类型',
            dataIndex: 'action',
            key: 'action',
            render(value) {
                const findItem = Constant.ActionOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '资源类型',
            dataIndex: 'resourceType',
            key: 'resourceType',
        },
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
        },
        {
            title: '操作',
            dataIndex: 'action_col',
            key: 'action_col',
            render(_, row) {
                return <TableActionButtons>
                    <Button type={'link'} onClick={() => openModal(row)}>编辑</Button>
                    <BasePopconfirm onConfirm={() => submitDel(row)}/>
                </TableActionButtons>;
            }
        }
    ]

    const onSearch = () => tableRef.current?.initPageSearch();
    const onReset = () => {
        setSearchModuleCode(undefined);
        setSearchName(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitDel = data => {
        return PermissionDel({id: data.id}).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }

    const baseFormRef = useRef();
    const [formData, setFormData] = useState({});
    const openModal = (data = {}) => {
        baseFormRef.current?.open({
            id: data.id,
            permissionCode: data.permissionCode,
            moduleCode: data.moduleCode,
            permissionName: data.permissionName,
            action: data.action,
            resourceType: data.resourceType,
            description: data.description,
            sortOrder: data.sortOrder ?? 0,
        })
    }
    const submitForm = (data) => {
        return PermissionSaveOrEdit(data).then(res => {
            message.success(res.data)
            baseFormRef.current?.close()
            tableRef.current?.getTableData()
        })
    }

    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'所属模块'}>
                    <BaseAntdSelect
                        value={searchModuleCode}
                        setValue={setSearchModuleCode}
                        style={{width: '13rem'}}
                        data={Constant.ModuleOptions}
                    />
                </SearchRow.Item>
                <SearchRow.Item title={'权限名称'}>
                    <BaseAntdInput value={searchName} setValue={setSearchName}/>
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
                api={PermissionPage}
                apiData={{
                    moduleCode: searchModuleCode,
                    permissionName: searchName,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  权限项编辑弹窗  */}
            <PermissionEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}
