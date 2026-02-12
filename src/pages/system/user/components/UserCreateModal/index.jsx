
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Form} from "antd";
import { FAntdInput } from 'izid'
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import {forwardRef} from "react";

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
            addTitle={'创建用户'}
            onSubmit={onSubmit}
        >
            <Form.Item label={'用户名'} name={'userName'} rules={easyNotNull('用户名')}>
                <FAntdInput/>
            </Form.Item>
            <Form.Item label={'手机号'} name={'phone'} rules={easyNotNull('手机号')}>
                <FAntdInput/>
            </Form.Item>
            <Form.Item label={'真实姓名'} name={'realName'} rules={easyNotNull('真实姓名')}>
                <FAntdInput/>
            </Form.Item>
            <Form.Item label={'性别'} name={'gender'} rules={easyNotNull('性别')}>
                <BaseAntdSelect data={Constant.GenderOptions}/>
            </Form.Item>
            <Form.Item label={'账户类型'} name={'accountType'} rules={easyNotNull('账户类型')}>
                <BaseAntdSelect data={Constant.UserTypeOptions}/>
            </Form.Item>
            <Form.Item label={'初始密码'} name={'sourcePwd'} rules={[easyNotNull('初始密码'),{ pattern: /^.{6,}$/, message: '密码必须不少于6位' }]}>
                <FAntdInput.Password allowClear={false}/>
            </Form.Item>
        </BaseFormModal>
    )
})