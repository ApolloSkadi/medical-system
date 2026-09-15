import {forwardRef, useImperativeHandle, useState} from "react";
import {Button, Checkbox, message, Modal, Spin} from "antd";
import {RoleList, UserRoleListByUser, UserRoleBindRoles} from "@/api/system/saas/index.js";

// 用户角色分配弹窗: 多角色勾选，保存时全量覆盖该用户的角色绑定
export default forwardRef(({onSubmit}, ref) => {
    const [userRow, setUserRow] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [checkedRoleIds, setCheckedRoleIds] = useState([]);

    const open = row => {
        if (!row?.id) {
            message.warning('参数错误');
            return;
        }
        setUserRow(row);
        setCheckedRoleIds([]);
        setVisible(true);
        setLoading(true);
        Promise.all([RoleList(), UserRoleListByUser({userId: row.id})])
            .then(([roleRes, boundRes]) => {
                // 平台用户仅可绑定平台级角色；租户用户仅可绑定本租户角色
                const options = (roleRes.data ?? []).filter(r => row.tenantId ? r.tenantId === row.tenantId : !r.tenantId);
                setRoles(options);
                setCheckedIds(boundRes);
            })
            .finally(() => setLoading(false));
    };
    const setCheckedIds = boundRes => {
        setCheckedRoleIds((boundRes.data ?? []).map(item => item.roleId));
    };
    const close = () => setVisible(false);
    useImperativeHandle(ref, () => ({open, close}), []);

    const submit = () => {
        if (loading) return;
        setLoading(true);
        Promise.resolve(onSubmit(userRow, checkedRoleIds)).finally(() => setLoading(false));
    };

    return (
        <Modal
            title={`分配角色 - ${userRow?.realName || userRow?.userName || ''}`}
            open={visible}
            onCancel={close}
            onOk={submit}
            okText={'保存'}
            cancelText={'取消'}
            width={'34rem'}
        >
            <Spin spinning={loading}>
                <div style={{marginBottom: '1rem', color: '#e6a23c'}}>
                    保存后将以勾选结果全量覆盖该用户的角色绑定，一个用户支持多个角色。
                </div>
                <Checkbox.Group value={checkedRoleIds} onChange={setCheckedRoleIds} style={{display: 'block'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '.5rem'}}>
                        {roles.map(r => (
                            <Checkbox key={r.id} value={r.id}>
                                {`${r.roleName}（${r.roleCode}）`}
                                {r.tenantName ? <span style={{color: '#999'}}> · {r.tenantName}</span> : <span style={{color: '#999'}}> · 平台级</span>}
                            </Checkbox>
                        ))}
                    </div>
                </Checkbox.Group>
                {!roles.length && !loading && (
                    <div style={{textAlign: 'center', color: '#999', padding: '1rem 0'}}>
                        暂无可分配的角色，请先在「角色管理」中维护
                    </div>
                )}
                <Button type={'link'} onClick={() => setCheckedRoleIds(roles.map(r => r.id))}>全选</Button>
                <Button type={'link'} onClick={() => setCheckedRoleIds([])}>清空</Button>
                <span style={{marginLeft: '.8rem'}}>已选 {checkedRoleIds.length} 个角色</span>
            </Spin>
        </Modal>
    )
})
