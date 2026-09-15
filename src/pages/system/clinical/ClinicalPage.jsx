import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Upload} from "antd";
import {FAntdInput} from "izid";
import {DownloadOutlined, FileOutlined, UploadOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import useAuthStore from "@/store/useAuthStore.js";
import SearchRow from "@/component/SearchRow/index.jsx";
import SearchBtnGroup from "@/component/SearchBtnGroup/index.jsx";
import BaseAntdTable from "@/component/BaseAntdTable/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import BasePopconfirm from "@/component/BasePopconfirm/index.jsx";
import TableActionButtons from "@/component/TableActionButtons/index.jsx";
import {hasPermission} from "@/utils/permission.js";
import {easyNotNull} from "@/utils/antd-validator.js";
import {SubjectList, ClinicalFileListByBiz, ClinicalFileUpload, ClinicalFileDelete, ClinicalFileDownload, ClinicalImport, ClinicalImportTemplate} from "@/api/system/clinical/index.js";
import {TenantList, UserRoleUserList} from "@/api/system/saas/index.js";

const DATE_FMT = 'YYYY-MM-DD';
const DATETIME_FMT = 'YYYY-MM-DD HH:mm:ss';
const BOOL_OPTIONS = [{label: '是', value: 1}, {label: '否', value: 0}];

// 业务附件面板: 上传/下载/删除(后端按租户隔离)
function AttachmentPanel({bizType, bizId, files, onReload}) {
    const download = f => {
        ClinicalFileDownload({id: f.id}).then(blob => {
            // 文件流响应: 直接使用返回的blob(勿再包一层, 否则内容会变成[object Object])
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = f.fileName;
            a.click();
            URL.revokeObjectURL(url);
        });
    };
    const delFile = f => {
        ClinicalFileDelete({id: f.id}).then(res => {
            message.success(res.data ?? '删除成功');
            onReload();
        });
    };
    return (
        <div>
            <Upload
                multiple
                showUploadList={false}
                customRequest={({file, onSuccess, onError}) => {
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('bizType', bizType);
                    fd.append('bizId', bizId);
                    ClinicalFileUpload(fd)
                        .then(() => {
                            message.success('上传成功');
                            onReload();
                            onSuccess?.();
                        })
                        .catch(onError);
                }}
            >
                <Button size={'small'} icon={<UploadOutlined/>}>上传附件</Button>
            </Upload>
            <div style={{marginTop: '.6rem'}}>
                {(files ?? []).map(f => (
                    <div key={f.id} style={{display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.15rem 0'}}>
                        <FileOutlined/>
                        <a style={{cursor: 'pointer'}} onClick={() => download(f)}>{f.fileName}</a>
                        <span style={{color: '#999', fontSize: 12}}>
                            {f.fileSize > 1024 * 1024 ? `${(f.fileSize / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(f.fileSize / 1024))} KB`}
                        </span>
                        <Button type={'link'} size={'small'} danger onClick={() => delFile(f)}>删除</Button>
                    </div>
                ))}
                {!(files ?? []).length && <div style={{color: '#999', fontSize: 12}}>暂无附件</div>}
            </div>
        </div>
    );
}

// SaaS临床业务通用页面工厂：按 configs.js 的表配置生成 列表+搜索+维护弹窗 页面
// 权限: 按钮/操作按 `${module}:view/create/edit/delete` 权限码控制
export const createClinicalPage = (config) => {
    function ClinicalPage() {
        const role = useAuthStore(state => state.role);
        const isPlatform = role === 'platform';
        const canCreate = hasPermission(`${config.module}:create`);
        const canEdit = hasPermission(`${config.module}:edit`);
        const canDelete = hasPermission(`${config.module}:delete`);

        const [searchSubjectId, setSearchSubjectId] = useState(undefined);
        const [searchTenantId, setSearchTenantId] = useState(undefined);
        const [extraSearch, setExtraSearch] = useState({});
        // 研究对象/负责人等动态选项
        const [subjectOptions, setSubjectOptions] = useState([]);
        const [userOptions, setUserOptions] = useState([]);
        const tableRef = useRef();

        useEffect(() => {
            if (config.subjectBased) {
                SubjectList().then(res => {
                    setSubjectOptions((res.data ?? []).map(s => ({
                        label: `${s.name}（${s.subjectNo}）`,
                        value: s.id,
                        name: s.name,
                    })));
                });
            }
            if (config.fields.some(f => f.optionsApi === 'userList')) {
                UserRoleUserList().then(res => {
                    setUserOptions((res.data ?? []).map(u => ({
                        label: u.realName ? `${u.realName}（${u.userName}）` : u.userName,
                        value: u.id,
                    })));
                });
            }
        }, []);

        const subjectMap = useMemo(
            () => Object.fromEntries(subjectOptions.map(s => [s.value, s])),
            [subjectOptions]);

        const fieldMap = useMemo(
            () => Object.fromEntries(config.fields.map(f => [f.name, f])),
            [config]);

        const resolveOptions = (field) => {
            if (field.options) return field.options;
            if (field.optionsApi === 'userList') return userOptions;
            return [];
        };

        const renderCell = (field, value) => {
            if (value === undefined || value === null || value === '') return '-';
            if (field?.type === 'select' || field?.type === 'bool') {
                const hit = resolveOptions(field).find(v => String(v.value) === String(value));
                return hit ? hit.label : value;
            }
            if (field?.type === 'date') return String(value).slice(0, 10);
            return String(value);
        };

        const columns = [
            ...(config.subjectBased ? [{
                title: '研究对象',
                dataIndex: 'subjectId',
                key: 'subjectId',
                render: value => subjectMap[value]?.name ?? (value ? `${String(value).slice(0, 12)}...` : '-'),
            }] : []),
            ...config.columns.map(name => ({
                title: fieldMap[name]?.label ?? name,
                dataIndex: name,
                key: name,
                render: value => renderCell(fieldMap[name], value),
            })),
            {title: '创建时间', dataIndex: 'createDate', key: 'createDate'},
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render(_, row) {
                    return <TableActionButtons>
                        {canEdit && <Button type={'link'} onClick={() => openModal(row)}>编辑</Button>}
                        {canDelete && <BasePopconfirm onConfirm={() => submitDel(row)}/>}
                    </TableActionButtons>;
                }
            }
        ];

        const onSearch = () => tableRef.current?.initPageSearch();
        const onReset = () => {
            setSearchSubjectId(undefined);
            setSearchTenantId(undefined);
            setExtraSearch({});
            return tableRef.current?.resetPageSearch();
        };
        const submitDel = data => {
            return config.api.Del({id: data.id}).then(res => {
                message.success(res.data);
                tableRef.current?.getTableData();
            });
        };

        const baseFormRef = useRef();
        const [formData, setFormData] = useState({});
        const [files, setFiles] = useState([]);
        const loadFiles = bizId => {
            if (!bizId) {
                setFiles([]);
                return;
            }
            ClinicalFileListByBiz({bizType: config.key, bizId}).then(res => setFiles(res.data ?? []));
        };
        const openModal = (data = {}) => {
            const values = {
                id: data.id,
                version: data.version,
                tenantId: data.tenantId,
                subjectId: data.subjectId,
            };
            config.fields.forEach(f => {
                let value = data[f.name];
                if ((f.type === 'date' || f.type === 'datetime') && value) {
                    value = dayjs(String(value).slice(0, f.type === 'date' ? 10 : 19));
                }
                values[f.name] = value !== undefined && value !== null ? value : (f.type === 'bool' ? 0 : undefined);
            });
            loadFiles(data.id);
            baseFormRef.current?.open(values);
        };
        const submitForm = (data) => {
            const payload = {...data};
            config.fields.forEach(f => {
                if (f.type === 'date') payload[f.name] = data[f.name] ? data[f.name].format(DATE_FMT) : undefined;
                if (f.type === 'datetime') payload[f.name] = data[f.name] ? data[f.name].format(DATETIME_FMT) : undefined;
            });
            return config.api.SaveOrEdit(payload).then(res => {
                message.success(res.data);
                baseFormRef.current?.close();
                tableRef.current?.getTableData();
            });
        };

        const renderControl = (field) => {
            switch (field.type) {
                case 'number':
                    return <InputNumber style={{width: '100%'}}/>;
                case 'select':
                    return <BaseAntdSelect data={resolveOptions(field)}/>;
                case 'bool':
                    return <BaseAntdSelect data={BOOL_OPTIONS}/>;
                case 'date':
                    return <DatePicker style={{width: '100%'}}/>;
                case 'datetime':
                    return <DatePicker showTime style={{width: '100%'}}/>;
                case 'textarea':
                    return <Input.TextArea rows={2}/>;
                default:
                    return <FAntdInput/>;
            }
        };
        // 字段两列一组布局，textarea独占一行
        const fieldRows = [];
        for (let i = 0; i < config.fields.length; i += 2) {
            fieldRows.push(config.fields.slice(i, i + 2));
        }

        // Excel导入
        const doImport = file => {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('bizType', config.key);
            ClinicalImport(fd).then(res => {
                const r = res.data ?? {};
                const errList = r.errorRows ?? [];
                Modal.info({
                    title: `导入完成：成功 ${r.success ?? 0} 条 / 失败 ${r.fail ?? 0} 条`,
                    width: '38rem',
                    content: errList.length ? (
                        <div style={{maxHeight: '18rem', overflowY: 'auto'}}>
                            {errList.map(e => (
                                <div key={e.row} style={{color: '#EE3D3D'}}>第 {e.row} 行：{e.message}</div>
                            ))}
                        </div>
                    ) : <div>全部导入成功</div>,
                });
                tableRef.current?.initPageSearch();
            });
        };
        // 下载导入模板
        const downloadTemplate = () => {
            ClinicalImportTemplate({bizType: config.key}).then(blob => {
                // 文件流响应: 直接使用返回的blob(勿再包一层, 否则内容会变成[object Object])
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${config.title}导入模板.xlsx`;
                a.click();
                URL.revokeObjectURL(url);
            });
        };

        const renderSearchControl = (item) => {
            if (item.type === 'select') return <BaseAntdSelect data={item.options}/>;
            return <BaseAntdInput value={extraSearch[item.name]} setValue={value => setExtraSearch({...extraSearch, [item.name]: value})}/>;
        };

        return (
            <>
                <SearchRow>
                    {config.subjectBased && (
                        <SearchRow.Item title={'研究对象'}>
                            <BaseAntdSelect
                                value={searchSubjectId}
                                setValue={setSearchSubjectId}
                                style={{width: '16rem'}}
                                data={subjectOptions}
                            />
                        </SearchRow.Item>
                    )}
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
                    {config.search.map(item => (
                        <SearchRow.Item title={item.label} key={item.name}>
                            {renderSearchControl(item)}
                        </SearchRow.Item>
                    ))}
                    <SearchRow.Item>
                        <SearchBtnGroup
                            onSearch={onSearch}
                            onReset={onReset}
                            onAdd={canCreate ? openModal : undefined}
                        >
                            <Upload accept=".xlsx,.xls" showUploadList={false}
                                    beforeUpload={file => { doImport(file); return false; }}>
                                <Button icon={<UploadOutlined/>} disabled={!canCreate}>导入</Button>
                            </Upload>
                            <Button icon={<DownloadOutlined/>} onClick={downloadTemplate}>模板</Button>
                        </SearchBtnGroup>
                    </SearchRow.Item>
                </SearchRow>
                <BaseAntdTable
                    api={config.api.Page}
                    apiData={{
                        subjectId: searchSubjectId,
                        tenantId: searchTenantId,
                        ...extraSearch,
                    }}
                    ref={tableRef}
                    columns={columns}
                    scroll={{x: 'max-content'}}
                />
                {/*  临床数据维护弹窗  */}
                <BaseFormModal
                    ref={baseFormRef}
                    data={formData}
                    setData={setFormData}
                    addTitle={`新增${config.title}`}
                    editTitle={`编辑${config.title}`}
                    modalArgs={{width: '52rem'}}
                    onSubmit={submitForm}
                >
                    {config.subjectBased && (
                        <Form.Item label={'研究对象'} name={'subjectId'} rules={easyNotNull('研究对象')}>
                            <BaseAntdSelect data={subjectOptions}/>
                        </Form.Item>
                    )}
                    {isPlatform && (
                        <Form.Item label={'所属租户'} name={'tenantId'} rules={easyNotNull('所属租户')}>
                            <BaseAntdSelect api={TenantList} labelName={'tenantName'} valueName={'id'}/>
                        </Form.Item>
                    )}
                    {fieldRows.map(pair => (
                        <Row gutter={12} key={pair[0].name}>
                            {pair.map(field => (
                                <Col span={field.type === 'textarea' ? 24 : 12} key={field.name}>
                                    <Form.Item
                                        label={field.label}
                                        name={field.name}
                                        rules={field.required ? easyNotNull(field.label) : undefined}
                                    >
                                        {renderControl(field)}
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    ))}
                    {/*  业务附件  */}
                    <Form.Item label={'附件'}>
                        {formData?.id
                            ? <AttachmentPanel bizType={config.key} bizId={formData.id} files={files} onReload={() => loadFiles(formData.id)}/>
                            : <div style={{color: '#999', fontSize: 13}}>保存记录后可上传附件</div>}
                    </Form.Item>
                </BaseFormModal>
            </>
        )
    }

    return ClinicalPage;
};
