import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, DatePicker, Form, Row, Switch, Input} from "antd";
import {FAntdInput} from "izid";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import {TenantList} from "@/api/system/saas/index.js";
import {jsonValidator} from "@/pages/system/saas/common.js";

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
            addTitle={'新增模块授权'}
            editTitle={'编辑模块授权'}
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
                    <Form.Item label={'功能模块'} name={'moduleCode'} rules={easyNotNull('功能模块')}>
                        <BaseAntdSelect data={Constant.ModuleOptions}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'模块显示名称'} name={'moduleName'}>
                        <FAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'授权到期时间(不填为永久)'}
                name={'expiresAt'}
            >
                <DatePicker showTime style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
                label={'模块配置参数(JSON)'}
                name={'configJson'}
                rules={[jsonValidator('模块配置参数')]}
            >
                <Input.TextArea rows={4} placeholder={'如：{"dashboardCards":["patientTotal"]}'} />
            </Form.Item>
            <Form.Item label={'是否启用'} name={'isEnabled'} valuePropName={'checked'}>
                <Switch checkedChildren="启用" unCheckedChildren="停用"/>
            </Form.Item>
        </BaseFormModal>
    )
})
