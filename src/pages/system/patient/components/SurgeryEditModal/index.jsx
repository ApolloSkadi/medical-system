import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Card, Col, Form, Row} from "antd";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import AutoCalculateInput from "@/component/AutoCalculateInput/index.jsx";

const rvefCalculate = ([rvedv, rvesv]) => {
    return rvedv.minus(rvesv);
}

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
            addTitle={'新增手术记录'}
            editTitle={'修改手术记录'}
            onSubmit={onSubmit}
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label={'手术日龄(日)'}
                        name={'surgeryAge'}
                        rules={easyNotNull('手术日龄')}
                    >
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
            </Row>

            <Card title="扩张前" size="small" className="mb-4">
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label={'右心室收缩压(mmHg)'} name={'befRightSystolicPressure'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'右心室舒张压(mmHg)'} name={'befRightDiastolicPressure'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'右心室平均压(mmHg)'} name={'befRightAveragePressure'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title="球囊信息" size="small" className="mb-4">
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label={'肺动脉瓣环(mm)'} name={'pulmonaryValveAnnulus'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'球囊扩张次数'} name={'balloonDilationCounts'}>
                            <BaseAntdInput strict/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'球囊长度(cm)'} name={'balloonLength'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'球囊宽度(mm)'} name={'balloonWidth'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title="扩张后" size="small">
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label={'右心室收缩压(mmHg)'} name={'aftRightSystolicPressure'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'肺动脉收缩压(mmHg)'} name={'pulmonaryPressure'}>
                            <BaseAntdInput float/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'跨瓣压差(mmHg)'} name={'transvalvularPressureGradient'}>
                            <AutoCalculateInput
                                name={'transvalvularPressureGradient'}
                                watchNames={['aftRightSystolicPressure', 'pulmonaryPressure']}
                                calculate={rvefCalculate}
                                setFormData={setFormData}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </BaseFormModal>
    )
})
