import {Card, Col, Form, Row} from "antd";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import AutoCalculateInput from "@/component/AutoCalculateInput/index.jsx";

const rvFacCalculate = ([rvEda, rvEsa]) => {
    if (rvEda.isZero()) return undefined;
    return rvEda.minus(rvEsa).div(rvEda).mul(100);
}

export default ({
    prefix,
    title = '心脏超声检查',
    setFormData,
}) => {
    const field = name => `${prefix}${name}`;

    return (
        <Card title={title} size="small" className="mb-4">
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label="RV-EDA(cm²)" name={field('EchoRvEda')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="RV-ESA(cm²)" name={field('EchoRvEsa')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label="RV-FAC(%)" name={field('EchoRvFac')}>
                        <AutoCalculateInput
                            name={field('EchoRvFac')}
                            watchNames={[field('EchoRvEda'), field('EchoRvEsa')]}
                            calculate={rvFacCalculate}
                            setFormData={setFormData}
                            inputProps={{suffix: '%'}}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="TAPSE(cm)" name={field('EchoTapse')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label="右心室长径(mm)" name={field('EchoRvLongDiameter')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="右心室横径(mm)" name={field('EchoRvTransverseDiameter')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="TDI-RV-S(cm/s)" name={field('EchoTdiRvS')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="TDI-RV-E'(cm/s)" name={field('EchoTdiRvE')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="TDI-RV-A'(cm/s)" name={field('EchoTdiRvA')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="三尖瓣瓣环(mm)" name={field('TricuspidAnnulus')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label="TV-E(m/s)" name={field('EchoTvE')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="TV-A(m/s)" name={field('EchoTvA')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="TR流速(m/s)" name={field('EchoTrVelocity')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="MPA流速(m/s)" name={field('EchoMpaVelocity')}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    )
}
