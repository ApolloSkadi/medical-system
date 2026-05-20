import {Card, Col, Form, Row} from "antd";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";
import { useEffect, useRef } from "react";
import AutoCalculateInput from "@/component/AutoCalculateInput/index.jsx";

const rvefCalculate = ([rvedv, rvesv]) => {
    if (rvedv.isZero()) return undefined;
    return rvedv.minus(rvesv).div(rvedv).mul(100);
}

export default ({ 
    formData, 
    setFormData,
}) => {
    const form = Form.useFormInstance();
    
    // 使用 useWatch 监听输入字段的变化
    const checkMriRightPost = Form.useWatch('checkMriRightPost', form);
    const checkMriRightNative = Form.useWatch('checkMriRightNative', form);
    const checkMriLeftPost = Form.useWatch('checkMriLeftPost', form);
    const checkMriLeftNative = Form.useWatch('checkMriLeftNative', form);
    const checkMriBloodPost = Form.useWatch('checkMriBloodPost', form);
    const checkMriBloodNative = Form.useWatch('checkMriBloodNative', form);
    const checkMriHct = Form.useWatch('checkMriHct', form);
    
    // 用于记录上一次计算的输入值，避免重复计算
    const prevCalculationRef = useRef(null);
    
    useEffect(() => {
        // 检查公共参数是否都已填写
        if (checkMriBloodPost !== undefined &&
            checkMriBloodPost !== '' &&
            checkMriBloodNative !== undefined &&
            checkMriBloodNative !== '' &&
            checkMriHct !== undefined &&
            checkMriHct !== '') {
            
            // 生成当前输入值的唯一标识，用于判断是否需要重新计算
            const currentInputKey = `${checkMriRightPost}-${checkMriRightNative}-${checkMriLeftPost}-${checkMriLeftNative}-${checkMriBloodPost}-${checkMriBloodNative}-${checkMriHct}`;
            
            // 如果输入值没有变化，则不重新计算
            if (prevCalculationRef.current === currentInputKey) {
                return;
            }
            
            // 记录当前输入值
            prevCalculationRef.current = currentInputKey;
            
            const calculateEcv = (post, native) => {
                if (post === undefined || post === '' || native === undefined || native === '') return undefined;

                const denominator = 1 / Number(checkMriBloodPost) - 1 / Number(checkMriBloodNative);
                if (!denominator) return undefined;

                const ecv = (1 - Number(checkMriHct) / 100) *
                    (1 / Number(post) - 1 / Number(native)) /
                    denominator * 100;

                if (!Number.isFinite(ecv)) return undefined;

                return ecv.toFixed(2);
            }

            const rightEcv = calculateEcv(checkMriRightPost, checkMriRightNative);
            const leftEcv = calculateEcv(checkMriLeftPost, checkMriLeftNative);
            
            // 更新表单中的 ECV 字段
            form.setFieldsValue({
                checkMriEcv: rightEcv,
                checkMriLeftEcv: leftEcv
            });
            
            // 同时更新父组件的状态
            if (setFormData) {
                setFormData((data) => ({
                    ...data,
                    checkMriEcv: rightEcv,
                    checkMriLeftEcv: leftEcv
                }));
            }
        }
    }, [checkMriRightPost, checkMriRightNative, checkMriLeftPost, checkMriLeftNative, checkMriBloodPost, checkMriBloodNative, checkMriHct, form, setFormData])

    return (
        <Card title="磁共振记录" size="small">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="右心室T1 post" name={"checkMriRightPost"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="右心室T1 native" name={"checkMriRightNative"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="左心室T1 post" name={"checkMriLeftPost"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="左心室T1 native" name={"checkMriLeftNative"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="血池T1 post" name={"checkMriBloodPost"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="血池T1 native" name={"checkMriBloodNative"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="HCT" name={"checkMriHct"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="右心室ECV" name={"checkMriEcv"}>
                        <BaseAntdInput float />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="左心室ECV" name={"checkMriLeftEcv"}>
                        <BaseAntdInput float />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="RVEDV(ml)" name={"checkMriRvedv"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="RVESV(ml)" name={"checkMriRvesv"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="RVEF(%)" name={"checkMriRvef"}>
                        <AutoCalculateInput
                            name="checkMriRvef"
                            watchNames={["checkMriRvedv", "checkMriRvesv"]}
                            calculate={rvefCalculate}
                            setFormData={setFormData}
                            inputProps={{suffix: '%'}}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="肺动脉瓣脉搏流量(ml)" name={"pulmonaryArteryFlow"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="肺动脉过瓣最大流速(cm/s)" name={"pulmonaryMaxFlowVelocity"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="三尖瓣脉搏流量(ml)" name={"tricuspidPulseFlow"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="三尖瓣过瓣最大流速(cm/s)" name={"tricuspidMaxFlowVelocity"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="三尖瓣反流分数(%)" name={"tricuspidRefluxFraction"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="右心室厚度(mm)" name={"rightVentricularThickness"}>
                        <BaseAntdInput float/>
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};
