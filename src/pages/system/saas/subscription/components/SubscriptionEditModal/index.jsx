import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, DatePicker, Form, InputNumber, Row, Switch} from "antd";
import {FAntdInput} from "izid";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import {TenantList} from "@/api/system/saas/index.js";

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
            addTitle={'新增订阅'}
            editTitle={'编辑订阅'}
            onSubmit={onSubmit}
        >
            <Form.Item label={'所属租户'} name={'tenantId'} rules={easyNotNull('所属租户')}>
                <BaseAntdSelect
                    api={TenantList}
                    labelName={'tenantName'}
                    valueName={'id'}
                />
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'订阅计划'} name={'planCode'} rules={easyNotNull('订阅计划')}>
                        <BaseAntdSelect data={Constant.PlanOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'计划名称'} name={'planName'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'开始日期'} name={'startDate'} rules={easyNotNull('开始日期')}>
                        <DatePicker style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'到期日期'} name={'endDate'} rules={easyNotNull('到期日期')}>
                        <DatePicker style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={8}>
                    <Form.Item label={'中心数量上限'} name={'maxCenters'}>
                        <InputNumber style={{width: '100%'}} min={0}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'用户数量上限'} name={'maxUsers'}>
                        <InputNumber style={{width: '100%'}} min={0}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'存储上限(MB)'} name={'maxStorageMb'}>
                        <InputNumber style={{width: '100%'}} min={0}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'状态'} name={'status'} rules={easyNotNull('状态')}>
                        <BaseAntdSelect data={Constant.SubscriptionStatusOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'自动续费'} name={'autoRenew'} valuePropName={'checked'}>
                        <Switch checkedChildren="是" unCheckedChildren="否"/>
                    </Form.Item>
                </Col>
            </Row>
        </BaseFormModal>
    )
})
