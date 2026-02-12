import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Form} from "antd";
import {FAntdInput} from "izid/dist/index.modern.mjs";
import {easyNotNull} from "@/utils/antd-validator.js";

export default forwardRef(({
    formData,
    setFormData,
    onSubmit
},ref) => {
    return (
        <BaseFormModal
            ref={ref}
            data={formData}
            setData={setFormData}
            addTitle={'修改密码'}
            onSubmit={onSubmit}
        >
            <Form.Item label={'新密码'} name={'newPwd'} rules={[
                easyNotNull('新密码'),
                { pattern: /^.{6,}$/, message: '密码必须不少于6位' }
            ]}>
                <FAntdInput.Password allowClear={false}/>
            </Form.Item>
            <Form.Item label={'确认密码'} name={'checkNewPwd'} rules={[
                easyNotNull('确认密码'),
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('newPwd') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                })
            ]}>
                <FAntdInput.Password allowClear={false}/>
            </Form.Item>
        </BaseFormModal>
    )
})