import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Form, Row, Switch} from "antd";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import useAuthStore from "@/store/useAuthStore.js";
import {TenantList} from "@/api/system/saas/index.js";

// 随访类型选项(与随访任务followupType编码一致: 1: 访视一, 2: 访视二, 3: 访视三, 4: 其他)
const FOLLOW_TYPE_OPTIONS = [
    {label: '访视一', value: 1},
    {label: '访视二', value: 2},
    {label: '访视三', value: 3},
    {label: '其他', value: 4},
];

// 随访提醒配置弹窗: 平台管理员需选择所属租户, 租户用户自动归属本租户
export default forwardRef(({
    formData,
    setFormData,
    onSubmit
}, ref) => {
    const role = useAuthStore(state => state.role);
    const isPlatform = role === 'platform';

    return (
        <BaseFormModal
            ref={ref}
            data={formData}
            setData={setFormData}
            addTitle={'新增提醒配置'}
            editTitle={'修改提醒配置'}
            onSubmit={onSubmit}
        >
            {isPlatform && (
                <Form.Item
                    label={'所属租户'}
                    name={'tenantId'}
                    rules={easyNotNull('所属租户')}
                >
                    <BaseAntdSelect api={TenantList} labelName={'tenantName'} valueName={'id'}/>
                </Form.Item>
            )}
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'随访类型'}
                        name={'followupType'}
                        rules={easyNotNull('随访类型')}
                    >
                        <BaseAntdSelect mode="multiple" data={FOLLOW_TYPE_OPTIONS}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={'提前提醒天数'}
                        name={'remainDay'}
                        rules={easyNotNull('提前提醒天数')}
                    >
                        <BaseAntdInput/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label={'机器人地址'}
                name={'accessToken'}
                rules={easyNotNull('机器人地址')}
                extra={'企业微信群机器人webhook地址, 提醒将推送到对应群'}
            >
                <BaseAntdInput/>
            </Form.Item>
            <Form.Item
                label={'状态'}
                name={'status'}
                rules={easyNotNull('状态')}
                valuePropName={'checked'}
            >
                <Switch checkedChildren="开启" unCheckedChildren="关闭"/>
            </Form.Item>
        </BaseFormModal>
    )
})
