import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Form, Row, Input} from "antd";
import {FAntdInput} from "izid";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";

export default forwardRef(({
    formData,
    setFormData,
    onSubmit
}, ref) => {
    return (
        <BaseFormModal
            ref={ref}
            data={formData}
            setData={setFormData}
            addTitle={'新增权限项'}
            editTitle={'编辑权限项'}
            onSubmit={onSubmit}
        >
            <Form.Item label={'权限编码'} name={'permissionCode'} rules={easyNotNull('权限编码')}
                       extra={'格式：模块:操作，如 patient:create'}>
                <FAntdInput/>
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'权限名称'} name={'permissionName'} rules={easyNotNull('权限名称')}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'所属模块'} name={'moduleCode'} rules={easyNotNull('所属模块')}>
                        <BaseAntdSelect data={Constant.ModuleOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'操作类型'} name={'action'} rules={easyNotNull('操作类型')}>
                        <BaseAntdSelect data={Constant.ActionOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'资源类型'} name={'resourceType'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'排序'} name={'sortOrder'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={'权限说明'} name={'description'}>
                <Input.TextArea rows={3}/>
            </Form.Item>
        </BaseFormModal>
    )
})
