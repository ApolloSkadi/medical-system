import {forwardRef, useImperativeHandle, useRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Form, Input, Row} from "antd";
import {FAntdInput} from "izid";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import {TenantList} from "@/api/system/saas/index.js";

// 角色编辑弹窗：仅维护基础信息；权限配置统一走列表「配置权限」弹窗
export default forwardRef(({
    formData,
    setFormData,
    onSubmit
}, ref) => {
    const innerRef = useRef();
    const open = (data) => innerRef.current?.open(data);
    const close = () => innerRef.current?.close();
    useImperativeHandle(ref, () => ({open, close}), []);

    return (
        <BaseFormModal
            ref={innerRef}
            data={formData}
            setData={setFormData}
            addTitle={'新增角色'}
            editTitle={'编辑角色'}
            onSubmit={onSubmit}
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
        </BaseFormModal>
    )
})
