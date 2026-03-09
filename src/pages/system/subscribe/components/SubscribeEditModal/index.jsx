import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Form, Row, Switch} from "antd";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
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
            addTitle={'新增配置'}
            editTitle={'修改配置'}
            onSubmit={onSubmit}
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'随访类型'}
                        name={'followupType'}
                        rules={easyNotNull('随访类型')}
                    >
                        <BaseAntdSelect
                            mode="multiple"
                            data={Constant.FollowTypeOptions}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'提醒日期'}
                        name={'remainDay'}
                        rules={easyNotNull('提醒日期')}
                    >
                        <BaseAntdInput />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'提醒地址'}
                name={'accessToken'}
                rules={easyNotNull('提醒地址')}
            >
                <BaseAntdInput />
            </Form.Item>
            <Form.Item
                label={'状态'}
                name={'status'}
                rules={easyNotNull('状态')}
            >
                <Switch checkedChildren="开启" unCheckedChildren="关闭"/>
            </Form.Item>
        </BaseFormModal>
    )
})