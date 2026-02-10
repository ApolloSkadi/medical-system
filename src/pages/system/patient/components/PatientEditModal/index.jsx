import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Form} from "antd";
import MriEcvCalculate from "@/component/MriEcvCalculate/index.jsx";
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
            setFormData={setFormData}
            addTitle={'新增病人'}
            editTitle={'修改病人'}
            onSubmit={onSubmit}
        >
            <Form.Item
                label={'患者姓名'}
                name={'name'}
            >
                <BaseAntdInput/>
            </Form.Item>
            <Form.Item
                label={'性别'}
                name={'gender'}
            >
                <BaseAntdInput/>
            </Form.Item>
            <Form.Item
                label={'出生体重(kg)'}
                name={'birthWeight'}
            >
                <BaseAntdInput/>
            </Form.Item>
            <Form.Item
                label={'胎龄(周)'}
                name={'gestationalAge'}
            >
                <BaseAntdInput/>
            </Form.Item>
            <MriEcvCalculate
                formData={formData}
                setFormData={setFormData}
            />
        </BaseFormModal>
    )
})