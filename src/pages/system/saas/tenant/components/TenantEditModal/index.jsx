import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Form, InputNumber, Row} from "antd";
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
            addTitle={'新增租户'}
            editTitle={'编辑租户'}
            onSubmit={onSubmit}
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'租户编码'} name={'tenantCode'} rules={easyNotNull('租户编码')}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'租户类型'} name={'tenantType'} rules={easyNotNull('租户类型')}>
                        <BaseAntdSelect data={Constant.TenantTypeOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={'医院/机构名称'} name={'tenantName'} rules={easyNotNull('医院/机构名称')}>
                <FAntdInput/>
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'机构简称'} name={'shortName'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'状态'} name={'status'} rules={easyNotNull('状态')}>
                        <BaseAntdSelect data={Constant.TenantStatusOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'对接联系人'} name={'contactPerson'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'联系电话'} name={'contactPhone'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'联系邮箱'} name={'contactEmail'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'数据存储区域'} name={'dataRegion'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={'机构地址'} name={'address'}>
                <FAntdInput/>
            </Form.Item>
            <Row gutter={12}>
                <Col span={8}>
                    <Form.Item label={'中心数量配额'} name={'maxCenters'}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'用户数量配额'} name={'maxUsers'}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'存储配额(MB)'} name={'maxStorageMb'}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
            </Row>
        </BaseFormModal>
    )
})
