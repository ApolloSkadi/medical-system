import {Card, Col, Form, Row} from "antd";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import { useEffect, useRef } from "react";

export default ({ formData, setFormData }) => {
    const form = Form.useFormInstance();
    
    // 使用 useWatch 监听五个输入字段的变化
    const checkMriRightPost = Form.useWatch('checkMriRightPost', form);
    const checkMriRightNative = Form.useWatch('checkMriRightNative', form);
    const checkMriBloodPost = Form.useWatch('checkMriBloodPost', form);
    const checkMriBloodNative = Form.useWatch('checkMriBloodNative', form);
    const checkMriHct = Form.useWatch('checkMriHct', form);
    
    // 用于记录上一次计算的输入值，避免重复计算
    const prevCalculationRef = useRef(null);
    
    useEffect(() => {
        // 检查所有五个参数是否都已填写
        if (checkMriRightPost !== undefined &&
            checkMriRightPost !== '' &&
            checkMriRightNative !== undefined &&
            checkMriRightNative !== '' &&
            checkMriBloodPost !== undefined &&
            checkMriBloodPost !== '' &&
            checkMriBloodNative !== undefined &&
            checkMriBloodNative !== '' &&
            checkMriHct !== undefined &&
            checkMriHct !== '') {
            
            // 生成当前输入值的唯一标识，用于判断是否需要重新计算
            const currentInputKey = `${checkMriRightPost}-${checkMriRightNative}-${checkMriBloodPost}-${checkMriBloodNative}-${checkMriHct}`;
            
            // 如果输入值没有变化，则不重新计算
            if (prevCalculationRef.current === currentInputKey) {
                return;
            }
            
            // 记录当前输入值
            prevCalculationRef.current = currentInputKey;
            
            // 计算 ECV 值
            const ecv = (1 - checkMriHct / 100) * 
                (1 / checkMriRightPost - 1 / checkMriBloodPost) / 
                (1 / checkMriRightNative - 1 / checkMriBloodNative);
            
            // 更新表单中的 ECV 字段
            form.setFieldValue('checkMriEcv', ecv);
            
            // 同时更新父组件的状态
            if (setFormData) {
                setFormData((data) => ({
                    ...data,
                    checkMriEcv: ecv
                }));
            }
        }
    }, [checkMriRightPost, checkMriRightNative, checkMriBloodPost, checkMriBloodNative, checkMriHct, form, setFormData])

    return (
        <Card title="磁共振记录" size="small">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="右心室T1 post" name={"checkMriRightPost"}>
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="右心室T1 native" name={"checkMriRightNative"}>
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="血池T1 post" name={"checkMriBloodPost"}>
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="血池T1 native" name={"checkMriBloodNative"}>
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="HCT" name={"checkMriHct"}>
                        <BaseAntdInput strict/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="ECV" name={"checkMriEcv"}>
                        <BaseAntdInput disabled />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};