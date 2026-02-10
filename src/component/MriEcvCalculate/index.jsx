import {Button, Card, Col, Form, Row} from "antd";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import { useEffect } from "react";

export default ({ formData, setFormData }) => {
    return (
        <Card title="磁共振记录" size="small">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="右心室T1 post" name="checkMriRightPost">
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="右心室T1 native" name="checkMriRightNative">
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="血池T1 post" name="checkMriBloodPost">
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="血池T1 native" name="checkMriBloodNative">
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="HCT" name="checkMriHct">
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="ECV" name="checkMriEcv">
                        <BaseAntdInput disabled />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};