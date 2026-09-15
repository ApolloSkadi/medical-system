import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import ModuleGrantEditModal from "@/pages/system/saas/moduleGrant/components/ModuleGrantEditModal/index.jsx";
import {ModuleGrantDel, ModuleGrantPage, ModuleGrantSaveOrEdit, TenantList} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";
import {useRef, useState} from "react";
import {Button, message} from "antd";

export default () => {
    const [searchTenantId, setSearchTenantId] = useState(undefined);
    const [searchModuleCode, setSearchModuleCode] = useState(undefined);
    const [searchEnabled, setSearchEnabled] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '租户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: '模块编码',
            dataIndex: 'moduleCode',
            key: 'moduleCode',
        },
        {
            title: '模块名称',
            dataIndex: 'moduleName',
            key: 'moduleName',
            render(value, row) {
                const findItem = Constant.ModuleOptions.find(v => v.value === row.moduleCode);
                return findItem?.label ?? value ?? '-'
            }
        },
        {
            title: '是否启用',
            dataIndex: 'isEnabled',
            key: 'isEnabled',
            render(value) {
                const findItem = Constant.StartCloseOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '授权到期时间',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            render(value) {
                return value ?? '永久'
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
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
        setSearchTenantId(undefined);
        setSearchModuleCode(undefined);
        setSearchEnabled(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitDel = data => {
        return ModuleGrantDel({id: data.id}).then(res => {
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
            moduleCode: data.moduleCode,
            moduleName: data.moduleName,
            isEnabled: data.isEnabled === undefined ? true : data.isEnabled === 1,
            configJson: data.configJson,
            expiresAt: data.expiresAt,
        })
    }
    const submitForm = (data) => {
        return ModuleGrantSaveOrEdit({
            ...data,
            isEnabled: data.isEnabled ? 1 : 0,
            expiresAt: data.expiresAt ? data.expiresAt.format('YYYY-MM-DD HH:mm:ss') : undefined,
        }).then(res => {
            message.success(res.data)
            baseFormRef.current?.close()
            tableRef.current?.getTableData()
        })
    }

    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'租户'}>
                    <BaseAntdSelect
                        value={searchTenantId}
                        setValue={setSearchTenantId}
                        style={{width: '15rem'}}
                        api={TenantList}
                        labelName={'tenantName'}
                        valueName={'id'}
                    />
                </SearchRow.Item>
                <SearchRow.Item title={'功能模块'}>
                    <BaseAntdSelect
                        value={searchModuleCode}
                        setValue={setSearchModuleCode}
                        style={{width: '13rem'}}
                        data={Constant.ModuleOptions}
                    />
                </SearchRow.Item>
                <SearchRow.Item title={'是否启用'}>
                    <BaseAntdSelect
                        value={searchEnabled}
                        setValue={setSearchEnabled}
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
                api={ModuleGrantPage}
                apiData={{
                    tenantId: searchTenantId,
                    moduleCode: searchModuleCode,
                    isEnabled: searchEnabled,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  模块授权弹窗  */}
            <ModuleGrantEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}
