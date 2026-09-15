import {forwardRef, useImperativeHandle, useMemo, useState} from "react";
import {Button, Checkbox, Modal, Spin, message} from "antd";
import {PermissionList, RolePermissionListByRole} from "@/api/system/saas/index.js";
import Constant from "@/utils/Constant.jsx";

// 角色权限独立配置弹窗：不涉及角色基础信息，仅勾选权限并全量覆盖保存
export default forwardRef(({onSubmit}, ref) => {
    // 当前配置的角色行
    const [roleRow, setRoleRow] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    // 全量权限项与已勾选权限id
    const [permissions, setPermissions] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]);

    const open = (row) => {
        if (!row?.id) {
            message.warning('请先保存角色后再配置权限');
            return;
        }
        setRoleRow(row);
        setCheckedIds([]);
        setVisible(true);
        setLoading(true);
        Promise.all([PermissionList(), RolePermissionListByRole({roleId: row.id})])
            .then(([permissionRes, grantedRes]) => {
                setPermissions(permissionRes.data ?? []);
                setCheckedIds((grantedRes.data ?? []).map(item => item.permissionId));
            })
            .finally(() => setLoading(false));
    };
    const close = () => setVisible(false);
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

    const submit = () => {
        if (loading) return;
        setLoading(true);
        Promise.resolve(onSubmit(roleRow, checkedIds)).finally(() => setLoading(false));
    };

    return (
        <Modal
            title={`配置权限 - ${roleRow?.roleName ?? ''}`}
            open={visible}
            onCancel={close}
            onOk={submit}
            okText={'保存'}
            cancelText={'取消'}
            width={'44rem'}
        >
            <Spin spinning={loading}>
                <div style={{marginBottom: '1rem', color: '#e6a23c'}}>
                    保存后将以勾选结果全量覆盖该角色已分配的权限，不影响角色基本信息。
                </div>
                {/* 单个Checkbox.Group包裹全部分组，保证onChange返回全局选中集合 */}
                <Checkbox.Group value={checkedIds} onChange={setCheckedIds} style={{display: 'block'}}>
                    {groups.map(([moduleCode, items]) => (
                        <div key={moduleCode} style={{marginBottom: '1.2rem'}}>
                            <div style={{fontWeight: 600, marginBottom: '.5rem'}}>{moduleLabel(moduleCode)}</div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '.4rem'}}>
                                {items.map(item => (
                                    <Checkbox key={item.id} value={item.id}>
                                        {`${item.permissionName}（${item.permissionCode}）`}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>
                    ))}
                    {!groups.length && !loading && (
                        <div style={{textAlign: 'center', color: '#999', padding: '1rem 0'}}>暂无可分配的权限项</div>
                    )}
                </Checkbox.Group>
                <Button type={'link'} onClick={() => setCheckedIds(permissions.map(item => item.id))}>全选</Button>
                <Button type={'link'} onClick={() => setCheckedIds([])}>清空</Button>
                <span style={{marginLeft: '.8rem'}}>已选 {checkedIds.length} 项</span>
            </Spin>
        </Modal>
    )
})
