import {useRef, useState} from "react";
import {Button, message} from "antd";
import useAuthStore from "@/store/useAuthStore.js";
import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import {hasPermission} from "@/utils/permission.js";
import {RemindConfigPage, RemindConfigSaveOrEdit, RemindConfigDel, RemindConfigTest, RemindJobTrigger} from "@/api/system/clinical/index.js";
import {TenantList} from "@/api/system/saas/index.js";
import RemindEditModal from "./components/RemindEditModal/index.jsx";
import Constant from "@/utils/Constant.jsx";

// SaaS临床-随访提醒: 提醒配置维护(企微机器人webhook/随访类型/提前天数) + 测试发送 + 手动触发
// 定时任务每日9点按配置自动扫描待完成随访任务推送提醒; 权限: follow_reminder:view/create/edit/delete
export default () => {
    const role = useAuthStore(state => state.role);
    const isPlatform = role === 'platform';
    const canCreate = hasPermission('follow_reminder:create');
    const canEdit = hasPermission('follow_reminder:edit');
    const canDelete = hasPermission('follow_reminder:delete');

    const [searchTenantId, setSearchTenantId] = useState(undefined);
    const [searchStatus, setSearchStatus] = useState(undefined);
    const tableRef = useRef();

    const columns = [
        ...(isPlatform ? [{title: '租户', dataIndex: 'tenantId', key: 'tenantId'}] : []),
        {
            title: '随访类型',
            dataIndex: 'followupTypeStr',
            key: 'followupTypeStr',
            render: value => value || '-',
        },
        {
            title: '提前提醒天数',
            dataIndex: 'remainDay',
            key: 'remainDay',
            render: value => (value === undefined || value === null ? '-' : `提前 ${value} 天`),
        },
        {
            title: '机器人地址',
            dataIndex: 'accessToken',
            key: 'accessToken',
            ellipsis: true,
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
                    {canEdit && <Button type={'link'} onClick={() => openModal(row)}>编辑</Button>}
                    {canEdit && <Button type={'link'} onClick={() => submitTest(row)}>测试</Button>}
                    {canDelete && <BasePopconfirm onConfirm={() => submitDel(row)}/>}
                </TableActionButtons>;
            }
        }
    ];

    const onSearch = () => tableRef.current?.initPageSearch();
    const onReset = () => {
        setSearchTenantId(undefined);
        setSearchStatus(undefined);
        return tableRef.current?.resetPageSearch();
    };

    const baseFormRef = useRef();
    const [formData, setFormData] = useState({});
    const openModal = (data = {}) => {
        baseFormRef.current?.open({
            id: data.id,
            version: data.version,
            tenantId: data.tenantId,
            accessToken: data.accessToken,
            followupType: data.followupType ? data.followupType.split(',').map(v => Number(v)) : [],
            remainDay: data.remainDay,
            status: data.status === 1,
        });
    };
    const submitForm = (data) => {
        return RemindConfigSaveOrEdit({
            id: data.id,
            version: data.version,
            tenantId: data.tenantId,
            accessToken: data.accessToken,
            followupType: (data.followupType ?? []).join(','),
            remainDay: Number(data.remainDay),
            status: data.status ? 1 : 0,
        }).then(res => {
            message.success(res.data)
            baseFormRef.current?.close()
            tableRef.current?.getTableData()
        })
    };
    const submitTest = data => {
        return RemindConfigTest({id: data.id, accessToken: data.accessToken}).then(res => {
            message.success(res.data)
        })
    };
    const submitDel = data => {
        return RemindConfigDel({id: data.id}).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData()
        })
    };

    const [jobTriggerLoading, setJobTriggerLoading] = useState(false)
    const subJobTrigger = () => {
        setJobTriggerLoading(true)
        return RemindJobTrigger().then(res => {
            message.success(res.data)
        }).finally(() => {
            setJobTriggerLoading(false)
        })
    }

    return (
        <>
            <SearchRow>
                {isPlatform && (
                    <SearchRow.Item title={'租户'}>
                        <BaseAntdSelect
                            value={searchTenantId}
                            setValue={setSearchTenantId}
                            style={{width: '14rem'}}
                            api={TenantList}
                            labelName={'tenantName'}
                            valueName={'id'}
                        />
                    </SearchRow.Item>
                )}
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
                        onAdd={canCreate ? openModal : undefined}
                    />
                </SearchRow.Item>
            </SearchRow>
            <SearchRow>
                <SearchRow.Item>
                    {canEdit && (
                        <Button type={'primary'} onClick={subJobTrigger} loading={jobTriggerLoading}>提醒任务触发</Button>
                    )}
                </SearchRow.Item>
            </SearchRow>
            <BaseAntdTable
                api={RemindConfigPage}
                apiData={{
                    tenantId: searchTenantId,
                    status: searchStatus,
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  随访提醒配置弹窗  */}
            <RemindEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}
