import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, DatePicker, Form, Input, Row} from "antd";
import {FAntdInput} from "izid/dist/index.modern.mjs";
import MriEcvCalculate from "@/component/MriEcvCalculate/index.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";

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
                <Col span={12}>
                    <Form.Item
                        label={'随访类型'}
                        name={'followupType'}
                    >
                        <BaseAntdSelect data={Constant.FollowTypeOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'随访体重'}
                        name={'followupWeight'}
                    >
                        <FAntdInput />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'主要诊断'}
                name={'mainDiagnosis'}
            >
                <Input.TextArea/>
            </Form.Item>
            <Form.Item
                label={'次要诊断'}
                name={'secondDiagnosis'}
            >
                <Input.TextArea/>
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'预计随访时间'}
                        name={'expectedFollowupDate'}
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
            <MriEcvCalculate
                formData={formData}
                setFormData={setFormData}
            />
            <Form.Item
                label={'备注'}
                name={'remark'}
            >
                <Input.TextArea/>
            </Form.Item>
        </BaseFormModal>
    )
})
