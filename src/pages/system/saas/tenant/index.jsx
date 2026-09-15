import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import TenantEditModal from "@/pages/system/saas/tenant/components/TenantEditModal/index.jsx";
import {TenantDel, TenantPage, TenantSaveOrEdit} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";
import {useRef, useState} from "react";
import {Button, message, Modal} from "antd";

export default () => {
    const [searchName, setSearchName] = useState(undefined);
    const [searchCode, setSearchCode] = useState(undefined);
    const [searchStatus, setSearchStatus] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '租户编码',
            dataIndex: 'tenantCode',
            key: 'tenantCode',
        },
        {
            title: '医院/机构名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: '简称',
            dataIndex: 'shortName',
            key: 'shortName',
        },
        {
            title: '类型',
            dataIndex: 'tenantType',
            key: 'tenantType',
            render(value) {
                const findItem = Constant.TenantTypeOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '联系人',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
        },
        {
            title: '联系电话',
            dataIndex: 'contactPhone',
            key: 'contactPhone',
        },
        {
            title: '配额(中心/用户/存储MB)',
            key: 'quota',
            render(_, row) {
                return `${row.maxCenters ?? '-'} / ${row.maxUsers ?? '-'} / ${row.maxStorageMb ?? '-'}`
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render(value) {
                const findItem = Constant.TenantStatusOptions.find(v => v.value === value);
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
        setSearchName(undefined);
        setSearchCode(undefined);
        setSearchStatus(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitDel = data => {
        return TenantDel({id: data.id}).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }

    const baseFormRef = useRef();
    const [formData, setFormData] = useState({});
    const openModal = (data = {}) => {
        baseFormRef.current?.open({
            id: data.id,
            tenantCode: data.tenantCode,
            tenantName: data.tenantName,
            shortName: data.shortName,
            tenantType: data.tenantType,
            contactPerson: data.contactPerson,
            contactPhone: data.contactPhone,
            contactEmail: data.contactEmail,
            address: data.address,
            logoUrl: data.logoUrl,
            status: data.status ?? 1,
            maxCenters: data.maxCenters,
            maxUsers: data.maxUsers,
            maxStorageMb: data.maxStorageMb,
            dataRegion: data.dataRegion,
        })
    }
    const submitForm = (data, isEdit) => {
        return TenantSaveOrEdit(data).then(res => {
            if (isEdit) {
                message.success(res.data)
            } else {
                // 新建租户会同步生成管理账号，弹窗展示账号信息
                Modal.success({
                    title: '租户创建成功',
                    content: res.data,
                    okText: '知道了',
                })
            }
            baseFormRef.current?.close()
            tableRef.current?.getTableData()
        })
    }

    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'机构名称'}>
                    <BaseAntdInput value={searchName} setValue={setSearchName}/>
                </SearchRow.Item>
                <SearchRow.Item title={'租户编码'}>
                    <BaseAntdInput value={searchCode} setValue={setSearchCode}/>
                </SearchRow.Item>
                <SearchRow.Item title={'状态'}>
                    <BaseAntdSelect
                        value={searchStatus}
                        setValue={setSearchStatus}
                        style={{width: '12rem'}}
                        data={Constant.TenantStatusOptions}
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
                api={TenantPage}
                apiData={{
                    tenantName: searchName,
                    tenantCode: searchCode,
                    status: searchStatus,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  租户编辑弹窗  */}
            <TenantEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}
