import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import {
    JobTrigger,
    SubscribeDel,
    SubscribePage,
    SubscribeSaveOrEdit,
    SubscribeTest
} from "@/api/system/subscribe/index.js";
import {useRef, useState} from "react";
import Constant from "@/utils/Constant.jsx";
import StatusLabel from "@/component/StatusLabel/index.jsx";
import {Button, message} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import SubscribeEditModal from "@/pages/system/subscribe/components/SubscribeEditModal/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";

export default () => {
    const [searchStatus, setSearchStatus] = useState(undefined);

    const tableRef = useRef();
    const columns = [
        {
            title: '随访类型',
            dataIndex: 'followupTypeStr',
            key: 'followupTypeStr',
        },
        {
            title: '提醒日期',
            dataIndex: 'remainDay',
            key: 'remainDay',
        },
        {
            title: '提醒地址',
            dataIndex: 'accessToken',
            key: 'accessToken',
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
            render(_, row) {
                return <TableActionButtons>
                    <Button type={'link'} onClick={() => openModal(row)}>
                        编辑
                    </Button>
                    <Button
                        type={'link'}
                        onClick={() => submitTest(row)}>
                        测试
                    </Button>
                    <BasePopconfirm onConfirm={() => submitDel(row)} />
                </TableActionButtons>;
            }
        }
    ]

    const onSearch = () => tableRef.current?.initPageSearch();
    const onReset = () => {
        setSearchStatus(undefined);
        return tableRef.current?.resetPageSearch();
    }
    const submitTest = data => {
        return SubscribeTest(data).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }
    const submitDel = data => {
        return SubscribeDel(data).then(res => {
            message.success(res.data)
            tableRef.current?.getTableData();
        })
    }
    const baseFormRef = useRef();
    const [formData, setFormData] = useState({})
    const openModal = data => {
        baseFormRef.current?.open({
            id: data.id,
            followupType: data.followupType ? data.followupType.split(',').map(v => Number(v))
                : [],
            remainDay: data.remainDay,
            accessToken: data.accessToken,
            status: data.status === 1,
        })
    }
    const submitForm = (data) => {
        return SubscribeSaveOrEdit({
            id: data.id,
            followupType: (data.followupType ?? []).join(','),
            remainDay: data.remainDay,
            accessToken: data.accessToken,
            status: data.status ? 1 : 0,
        }).then(res => {
            message.success(res.data)
            baseFormRef.current?.close()
            tableRef.current?.getTableData()
        })
    }
    const [jobTriggerLoading, setJobTriggerLoading] = useState(false)
    const subJobTrigger = () => {
        setJobTriggerLoading(true)
        return JobTrigger().then(res => {
            message.success(res.data)

        }).finally(()=> {
            setJobTriggerLoading(false)
        })
    }

    return (
        <>
            <SearchRow>
                <SearchRow.Item title={'状态'}>
                    <BaseAntdSelect
                        value={searchStatus}
                        setValue={setSearchStatus}
                        style={{width: '15rem'}}
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
            <SearchRow>
                <SearchRow.Item>
                    <Button type={'primary'} onClick={subJobTrigger} loading={jobTriggerLoading}>提醒任务触发</Button>
                </SearchRow.Item>
            </SearchRow>
            <BaseAntdTable
                api={SubscribePage}
                apiData={{
                    status: searchStatus
                }}
                ref={tableRef}
                columns={columns}
            />
            {/*  提醒配置弹窗  */}
            <SubscribeEditModal
                ref={baseFormRef}
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitForm}
            />
        </>
    )
}