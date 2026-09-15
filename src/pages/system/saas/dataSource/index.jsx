import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import DataSourceEditModal from "@/pages/system/saas/dataSource/components/DataSourceEditModal/index.jsx";
import {
    DataSourceDel,
    DataSourcePage,
    DataSourceSaveOrEdit,
    TenantList,
} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";
import {useRef, useState} from "react";
import {Button, message} from "antd";

export default () => {
    const [searchTenantId, setSearchTenantId] = useState(undefined);
    const [searchSourceType, setSearchSourceType] = useState(undefined);
    const [searchStatus, setSearchStatus] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '租户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: '数据源名称',
            dataIndex: 'sourceName',
            key: 'sourceName',
        },
        {
            title: '来源类型',
            dataIndex: 'sourceType',
            key: 'sourceType',
            render(value) {
                const findItem = Constant.SourceTypeOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '模板版本',
            dataIndex: 'templateVersion',
            key: 'templateVersion',
            render(value) {
                return value ?? '-'
            }
        },
        {
            title: '字段映射',
            dataIndex: 'fieldMappingJson',
            key: 'fieldMappingJson',
            render(value) {
                return value ? '已配置' : '-'
            }
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
        setSearchSourceType(undefined);
        setSearchStatus(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitDel = data => {
        return DataSourceDel({id: data.id}).then(res => {
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
            sourceName: data.sourceName,
            sourceType: data.sourceType,
            templateVersion: data.templateVersion,
            status: data.status === undefined ? 1 : data.status,
            fieldMappingJson: data.fieldMappingJson,
            enumMappingJson: data.enumMappingJson,
            unitMappingJson: data.unitMappingJson,
        })
    }
    const submitForm = (data) => {
        return DataSourceSaveOrEdit(data).then(res => {
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
                <SearchRow.Item title={'来源类型'}>
                    <BaseAntdSelect
                        value={searchSourceType}
                        setValue={setSearchSourceType}
                        style={{width: '12rem'}}
                        data={Constant.SourceTypeOptions}
                    />
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
                api={DataSourcePage}
                apiData={{
                    tenantId: searchTenantId,
                    sourceType: searchSourceType,
                    status: searchStatus,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  数据源编辑弹窗  */}
            <DataSourceEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}
