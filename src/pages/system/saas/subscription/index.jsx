import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import SubscriptionEditModal from "@/pages/system/saas/subscription/components/SubscriptionEditModal/index.jsx";
import {SubscriptionDel, SubscriptionPage, SubscriptionSaveOrEdit, TenantList} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";
import {useRef, useState} from "react";
import {Button, message} from "antd";

export default () => {
    const [searchTenantId, setSearchTenantId] = useState(undefined);
    const [searchPlanCode, setSearchPlanCode] = useState(undefined);
    const [searchStatus, setSearchStatus] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '租户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: '订阅计划',
            dataIndex: 'planCode',
            key: 'planCode',
            render(value) {
                const findItem = Constant.PlanOptions.find(v => v.value === value);
                if (findItem) return <StatusLabel color={findItem.color}>{findItem.label}</StatusLabel>
                return <StatusLabel/>
            }
        },
        {
            title: '计划名称',
            dataIndex: 'planName',
            key: 'planName',
        },
        {
            title: '开始日期',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: '到期日期',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: '配额(中心/用户/存储MB)',
            key: 'quota',
            render(_, row) {
                return `${row.maxCenters ?? '-'} / ${row.maxUsers ?? '-'} / ${row.maxStorageMb ?? '-'}`
            }
        },
        {
            title: '自动续费',
            dataIndex: 'autoRenew',
            key: 'autoRenew',
            render(value) {
                return <StatusLabel color={value === 1 ? 'success' : 'default'}>{value === 1 ? '是' : '否'}</StatusLabel>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render(value) {
                const findItem = Constant.SubscriptionStatusOptions.find(v => v.value === value);
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
                    <BasePopconfirm onConfirm={() => submitDel(row)}/>
                </TableActionButtons>;
            }
        }
    ]

    const onSearch = () => tableRef.current?.initPageSearch();
    const onReset = () => {
        setSearchTenantId(undefined);
        setSearchPlanCode(undefined);
        setSearchStatus(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitDel = data => {
        return SubscriptionDel({id: data.id}).then(res => {
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
            planCode: data.planCode,
            planName: data.planName,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status === undefined ? 1 : data.status,
            maxCenters: data.maxCenters,
            maxUsers: data.maxUsers,
            maxStorageMb: data.maxStorageMb,
            autoRenew: data.autoRenew === 1,
        })
    }
    const submitForm = (data) => {
        return SubscriptionSaveOrEdit({
            ...data,
            startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : undefined,
            endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : undefined,
            autoRenew: data.autoRenew ? 1 : 0,
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
                <SearchRow.Item title={'订阅计划'}>
                    <BaseAntdSelect
                        value={searchPlanCode}
                        setValue={setSearchPlanCode}
                        style={{width: '12rem'}}
                        data={Constant.PlanOptions}
                    />
                </SearchRow.Item>
                <SearchRow.Item title={'状态'}>
                    <BaseAntdSelect
                        value={searchStatus}
                        setValue={setSearchStatus}
                        style={{width: '10rem'}}
                        data={Constant.SubscriptionStatusOptions}
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
                api={SubscriptionPage}
                apiData={{
                    tenantId: searchTenantId,
                    planCode: searchPlanCode,
                    status: searchStatus,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  订阅编辑弹窗  */}
            <SubscriptionEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}
