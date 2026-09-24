import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Upload} from "antd";
import {FAntdInput} from "izid";
import {FileOutlined, FileExcelOutlined, ImportOutlined, UploadOutlined} from "@ant-design/icons";
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
import {SubjectList, ClinicalFileListByBiz, ClinicalFileUpload, ClinicalFileDelete, ClinicalFileDownload, ClinicalImport, ClinicalImportTemplate, ClinicalExport} from "@/api/system/clinical/index.js";
import {TenantList, UserRoleUserList} from "@/api/system/saas/index.js";

const DATE_FMT = 'YYYY-MM-DD';
const DATETIME_FMT = 'YYYY-MM-DD HH:mm:ss';
const BOOL_OPTIONS = [{label: '是', value: 1}, {label: '否', value: 0}];

// 触发浏览器下载(blob流直接使用, 勿再包一层Blob)
const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
};

// 机械通气多组编辑器: 动态增删行, 小时留空由后端按起止自动计算
function VentilationsEditor({value, onChange}) {
    const rows = Array.isArray(value) ? value : [];
    const computedHours = r => {
        if (!r?.startTime || !r?.endTime) return null;
        const start = dayjs(r.startTime);
        const end = dayjs(r.endTime);
        if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return null;
        return Math.round(end.diff(start) / 360000.0) / 10.0;
    };
    // 更新一行: 起止时间齐时自动计算小时并写入值
    const update = (i, patch) => {
        const merged = {...rows[i], ...patch};
        merged.hours = computedHours(merged);
        onChange?.(rows.map((r, idx) => (idx === i ? merged : r)));
    };
    const totalHours = rows.reduce((sum, r) => sum + (computedHours(r) ?? 0), 0);
    return (
        <div style={{width: '100%'}}>
            {rows.map((r, i) => (
                <Row gutter={8} key={i} style={{marginBottom: '.4rem'}} align="middle">
                    <Col span={10}>
                        <DatePicker showTime style={{width: '100%'}} placeholder="机械通气开始时间"
                                    value={r.startTime ? dayjs(r.startTime) : null}
                                    onChange={t => update(i, {startTime: t})}/>
                    </Col>
                    <Col span={10}>
                        <DatePicker showTime style={{width: '100%'}} placeholder="机械通气结束时间"
                                    value={r.endTime ? dayjs(r.endTime) : null}
                                    onChange={t => update(i, {endTime: t})}/>
                    </Col>
                    <Col span={2}>
                        <span style={{fontSize: 12, color: '#999', whiteSpace: 'nowrap'}}>
                            {computedHours(r) !== null ? `${computedHours(r)}h` : '自动'}
                        </span>
                    </Col>
                    <Col span={2}>
                        <Button size={'small'} type={'link'} danger
                                onClick={() => onChange?.(rows.filter((_, idx) => idx !== i))}>删</Button>
                    </Col>
                </Row>
            ))}
            <Button size={'small'} type={'dashed'}
                    onClick={() => onChange?.([...rows, {}])}>+ 添加一组机械通气</Button>
            {rows.length > 0 && (
                <div style={{fontSize: 12, color: '#52c41a', marginTop: '.3rem'}}>
                    合计 {Math.round(totalHours * 10) / 10} 小时（保存后写入总小时数）
                </div>
            )}
        </div>
    );
}

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
            if (field?.type === 'datetime') return String(value).slice(0, 19).replace('T', ' ');
            return String(value);
        };

        const columns = [
            ...(config.subjectBased ? [{
                title: '研究对象',
                dataIndex: 'subjectId',
                key: 'subjectId',
                // 研究对象姓名在另一张表, 主表只有subjectId(无业务含义), 不参与排序
                render: value => subjectMap[value]?.name ?? (value ? `${String(value).slice(0, 12)}...` : '-'),
            }] : []),
            ...config.columns.map(col => {
                const name = typeof col === 'string' ? col : col.name;
                const label = typeof col === 'string' ? (fieldMap[name]?.label ?? name) : col.label;
                return {
                    title: label,
                    dataIndex: name,
                    key: name,
                    // 服务端排序: 整体数据按列名正序/倒序(后端按白名单映射到实体列)
                    sorter: true,
                    render: value => renderCell(fieldMap[name], value),
                };
            }),
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
                if (f.type === 'ventilations' && Array.isArray(data[f.name])) {
                    payload[f.name] = data[f.name]
                        .filter(v => v.startTime || v.endTime)
                        .map(v => ({
                            startTime: v.startTime ? dayjs(v.startTime).format(DATETIME_FMT) : undefined,
                            endTime: v.endTime ? dayjs(v.endTime).format(DATETIME_FMT) : undefined,
                            hours: v.hours ?? null,
                        }));
                }
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
                case 'ventilations':
                    return <VentilationsEditor/>;
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
                downloadBlob(blob, `${config.title}导入模板.xlsx`);
            });
        };
        // 按当前筛选导出数据(结构与导入模板一致, 可直接再导入)
        const doExport = () => {
            return ClinicalExport({
                bizType: config.key,
                tenantId: searchTenantId,
                ...extraSearch,
            }).then(blob => {
                downloadBlob(blob, `${config.title}导出_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`);
            });
        };

        const renderSearchControl = (item) => {
            // 下拉框与输入框宽度保持一致(输入框默认 minWidth 15rem); 选中值需绑定进extraSearch才参与查询
            if (item.type === 'select') return <BaseAntdSelect data={item.options} style={{width: '15rem'}}
                                                               value={extraSearch[item.name]}
                                                               setValue={value => setExtraSearch({...extraSearch, [item.name]: value})}/>;
            return <BaseAntdInput value={extraSearch[item.name]} setValue={value => setExtraSearch({...extraSearch, [item.name]: value})}/>;
        };

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
                            onExport={doExport}
                        >
                            <Upload accept=".xlsx,.xls" showUploadList={false}
                                    beforeUpload={file => { doImport(file); return false; }}>
                                <Button icon={<ImportOutlined/>} disabled={!canCreate}>导入</Button>
                            </Upload>
                            <Button icon={<FileExcelOutlined/>} onClick={downloadTemplate}>模板</Button>
                        </SearchBtnGroup>
                    </SearchRow.Item>
                </SearchRow>
                <BaseAntdTable
                    api={config.api.Page}
                    apiData={{
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
