import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Form, Input, DatePicker, Switch, Row, Col} from "antd";
import MriEcvCalculate from "@/component/MriEcvCalculate/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import { FAntdInput } from 'izid'
import Constant from "@/utils/Constant.jsx";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";

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
            addTitle={'新增病人'}
            editTitle={'修改病人'}
            onSubmit={onSubmit}
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'患者姓名'}
                        name={'name'}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'性别'}
                        name={'gender'}
                    >
                        <BaseAntdSelect data={Constant.GenderOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'出生体重(kg)'}
                        name={'birthWeight'}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'胎龄(周)'}
                        name={'gestationalAge'}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'门诊号'}
                        name={'outpatientNo'}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'住院号'}
                        name={'inpatientNo'}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'出生日期'}
                        name={'birthDate'}
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
                        label={'手术日龄'}
                        name={'surgeryAge'}
                    >
                        <BaseAntdInput/>
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
                        label={'联系电话'}
                        name={'phone'}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'基线检查日期'}
                        name={'baseCheckDate'}
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
                label={'基线检查心超结果'}
                name={'baseCheckResult'}
            >
                <Input.TextArea/>
            </Form.Item>
            <MriEcvCalculate
                formData={formData}
                setFormData={setFormData}
            />
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'过敏史'}
                        name={'allergyHistory'}
                    >
                        <Switch checkedChildren="有" unCheckedChildren="无" />
                    </Form.Item>
                        </Col>
                <Col span={12}>
                    <Form.Item
                        label={'既往病史'}
                        name={'medicalHistory'}
                    >
                        <Switch checkedChildren="有" unCheckedChildren="无" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'金属植入史'}
                name={'metalImplantHistory'}
            >
                <Switch checkedChildren="有" unCheckedChildren="无" />
            </Form.Item>
        </BaseFormModal>
    )
})
