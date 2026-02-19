import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Form} from "antd";
import {easyNotNull} from "@/utils/antd-validator.js";
import AntdDragUpload from "@/component/AntdDragUpload/index.jsx";

export default forwardRef (({
    formData,
    setFormData,
    onSubmit,
},ref) => {
    return(
        <BaseFormModal
            ref={ref}
            data={formData}
            setData={setFormData}
            addTitle={'上传文件'}
            onSubmit={onSubmit}
        >
            <Form.Item
                label={'数据文件'}
                valuePropName={'fileList'}
                name={'fileList'}
                rules={easyNotNull('文件')}
            >
                <AntdDragUpload />
            </Form.Item>
        </BaseFormModal>
    )
})