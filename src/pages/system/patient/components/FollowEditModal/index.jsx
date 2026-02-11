import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Row} from "antd";

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

                </Col>
            </Row>
        </BaseFormModal>
    )
})
