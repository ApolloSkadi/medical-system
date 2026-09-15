import {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Button, Checkbox, Col, Form, Input, Row, Spin} from "antd";
import {FAntdInput} from "izid";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import {PermissionList, RolePermissionListByRole, TenantList} from "@/api/system/saas/index.js";

// 角色编辑弹窗：基础信息 + 权限配置(按模块分组勾选，保存时全量覆盖)
export default forwardRef(({
    formData,
    setFormData,
    onSubmit
}, ref) => {
    const innerRef = useRef();
    // 全量权限项与已勾选权限id
    const [permissions, setPermissions] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]);
    const [permissionLoading, setPermissionLoading] = useState(false);

    useEffect(() => {
        PermissionList().then(res => setPermissions(res.data ?? []));
    }, []);

    // 打开时重置勾选；编辑时回填该角色已分配权限
    const open = (data) => {
        setCheckedIds([]);
        if (data?.id) {
            setPermissionLoading(true);
            RolePermissionListByRole({roleId: data.id})
                .then(res => setCheckedIds((res.data ?? []).map(item => item.permissionId)))
                .finally(() => setPermissionLoading(false));
        }
        innerRef.current?.open(data);
    };
    const close = () => innerRef.current?.close();
    useImperativeHandle(ref, () => ({open, close}), []);

    // 按模块分组渲染
    const groups = useMemo(() => {
        const moduleMap = new Map();
        (permissions ?? []).forEach(item => {
            if (!moduleMap.has(item.moduleCode)) moduleMap.set(item.moduleCode, []);
            moduleMap.get(item.moduleCode).push(item);
        });
        return [...moduleMap.entries()];
    }, [permissions]);
    const moduleLabel = code => Constant.ModuleOptions.find(v => v.value === code)?.label ?? code;

    return (
        <BaseFormModal
            ref={innerRef}
            data={formData}
            setData={setFormData}
            addTitle={'新增角色'}
            editTitle={'编辑角色'}
            onSubmit={(data, isEdit) => onSubmit({...data, permissionIds: checkedIds}, isEdit)}
        >
            <Form.Item label={'角色名称'} name={'roleName'} rules={easyNotNull('角色名称')}
                       extra={'角色编码由系统自动生成，无需填写'}>
                <FAntdInput/>
            </Form.Item>
            <Form.Item label={'所属租户(不选为平台级角色)'} name={'tenantId'}>
                <BaseAntdSelect
                    api={TenantList}
                    labelName={'tenantName'}
                    valueName={'id'}
                />
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'角色类型'} name={'roleType'} rules={easyNotNull('角色类型')}>
                        <BaseAntdSelect data={Constant.RoleTypeOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'数据范围'} name={'dataScope'} rules={easyNotNull('数据范围')}>
                        <BaseAntdSelect data={Constant.DataScopeOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'排序'} name={'sortOrder'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'状态'} name={'status'} rules={easyNotNull('状态')}>
                        <BaseAntdSelect data={Constant.StartCloseOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={'角色说明'} name={'description'}>
                <Input.TextArea rows={2}/>
            </Form.Item>
            {/*  权限配置  */}
            <Form.Item label={`角色权限(已选${checkedIds.length}项)`}>
                <Spin spinning={permissionLoading}>
                    {/* 单个Checkbox.Group包裹全部分组，保证onChange返回全局选中集合 */}
                    <Checkbox.Group value={checkedIds} onChange={setCheckedIds} style={{display: 'block'}}>
                        {groups.map(([moduleCode, items]) => (
                            <div key={moduleCode} style={{marginBottom: '.8rem'}}>
                                <div style={{fontWeight: 600, marginBottom: '.3rem'}}>{moduleLabel(moduleCode)}</div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '.3rem'}}>
                                    {items.map(item => (
                                        <Checkbox key={item.id} value={item.id}>
                                            {`${item.permissionName}（${item.permissionCode}）`}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {!groups.length && !permissionLoading && (
                            <div style={{color: '#999'}}>暂无可分配的权限项，请先在「权限项管理」中维护</div>
                        )}
                    </Checkbox.Group>
                    <Button type={'link'} size={'small'}
                            onClick={() => setCheckedIds(permissions.map(item => item.id))}>全选</Button>
                    <Button type={'link'} size={'small'} onClick={() => setCheckedIds([])}>清空</Button>
                </Spin>
            </Form.Item>
        </BaseFormModal>
    )
})
