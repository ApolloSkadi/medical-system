import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, DatePicker, Form, Input, Row, Switch} from "antd";
import {FAntdInput} from "izid/dist/index.modern.mjs";
import MriEcvCalculate from "@/component/MriEcvCalculate/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import EchoCard from "@/component/EchoCard/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";

export default forwardRef(({
    formData,
    setFormData,
    onSubmit,
}, ref) => {
    return (
        <BaseFormModal
            ref={ref}
            data={formData}
            setData={setFormData}
            addTitle={'新增随访记录'}
            editTitle={'修改随访记录'}
            onSubmit={onSubmit}
        >
            <Row gutter={12}>
                <Col span={24}>
                    <Form.Item
                        label={'随访类型'}
                        name={'followupType'}
                        rules={easyNotNull('随访类型')}
                    >
                        <BaseAntdSelect data={Constant.FollowTypeOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'随访身高(cm)'}
                        name={'followupHeight'}
                    >
                        <FAntdInput  suffix="cm" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'随访体重(kg)'}
                        name={'followupWeight'}
                    >
                        <FAntdInput  suffix="kg" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'预计随访时间'}
                        name={'expectedFollowupDate'}
                        rules={easyNotNull('预计随访时间')}
                    >
                        <DatePicker
                            placeholder="请选择"
                            style={{width: '100%'}}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'实际随访时间'}
                        name={'actualFollowupDate'}
                    >
                        <DatePicker
                            placeholder="请选择"
                            style={{width: '100%'}}
                            allowClear
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'随访检查心超结果'}
                name={'followupCheckResult'}
            >
                <Input.TextArea/>
            </Form.Item>
            <EchoCard
                prefix="followup"
                setFormData={setFormData}
            />
            {
                (
                    formData?.followupType === 3 ||
                    formData?.followupType === 4
                ) &&
                <MriEcvCalculate
                    formData={formData}
                    setFormData={setFormData}
                />
            }
            
            <Row gutter={12} className={'mt-2'}>
                <Col span={12}>
                    <Form.Item
                        label={'是否方案偏离'}
                        name={'protocolDeviation'}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'是否不良事件'}
                        name={'adverseEvent'}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.protocolDeviation !== cur.protocolDeviation}>
                {({getFieldValue}) => getFieldValue('protocolDeviation') ? (
                    <Form.Item
                        label={'方案偏离详情'}
                        name={'protocolDeviationDetail'}
                    >
                        <Input.TextArea/>
                    </Form.Item>
                ) : null}
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.adverseEvent !== cur.adverseEvent}>
                {({getFieldValue}) => getFieldValue('adverseEvent') ? (
                    <Form.Item
                        label={'不良事件详情'}
                        name={'adverseEventDetail'}
                    >
                        <Input.TextArea/>
                    </Form.Item>
                ) : null}
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'血钾水平(mmol/L)'}
                        name={'bloodPotassium'}
                    >
                        <BaseAntdInput float suffix="mmol/L"/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'备注'}
                name={'remark'}
            >
                <Input.TextArea/>
            </Form.Item>
        </BaseFormModal>
    )
})
