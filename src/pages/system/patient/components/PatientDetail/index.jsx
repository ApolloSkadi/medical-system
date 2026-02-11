import { forwardRef, useState, useImperativeHandle } from "react";
import { Descriptions, Card, Divider } from "antd";
import DraggableModal from "@/component/DraggableModal";

export default forwardRef(({
    data
}, ref) => {
    const [visible, setVisible] = useState(false);
    
    // 打开弹出框
    const open = () => {
        setVisible(true);
    };
    
    // 关闭
    const close = () => {
        setVisible(false);
    };
    
    // 暴露相关方法
    useImperativeHandle(
        ref,
        () => {
            return {
                open,
                close
            };
        },
        [],
    );

    // 格式化日期显示
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        if (typeof dateStr === 'string') return dateStr.split('T')[0];
        return dateStr;
    };

    // 格式化开关值显示
    const formatSwitch = (value) => {
        if (value === true || value === 1 || value === '1') return '有';
        if (value === false || value === 0 || value === '0') return '无';
        return '-';
    };

    return (
        <DraggableModal
            title={'患者详情'}
            cancelText={'关闭'}
            modalArgs={{
                width: 1000
            }}
            open={visible}
            onCancel={close}
        >
            <Descriptions
                title="基本信息"
                bordered
                column={2}
                size="small"
            >
                <Descriptions.Item label="患者姓名">{data?.name || '-'}</Descriptions.Item>
                <Descriptions.Item label="性别">{data?.gender || '-'}</Descriptions.Item>
                <Descriptions.Item label="出生体重(kg)">{data?.birthWeight || '-'}</Descriptions.Item>
                <Descriptions.Item label="胎龄(周)">{data?.gestationalAge || '-'}</Descriptions.Item>
                <Descriptions.Item label="门诊号">{data?.outpatientNo || '-'}</Descriptions.Item>
                <Descriptions.Item label="住院号">{data?.inpatientNo || '-'}</Descriptions.Item>
                <Descriptions.Item label="出生日期">{formatDate(data?.birthDate)}</Descriptions.Item>
                <Descriptions.Item label="手术日龄">{data?.surgeryAge || '-'}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{data?.phone || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions
                title="诊断信息"
                bordered
                column={1}
                size="small"
            >
                <Descriptions.Item label="主要诊断">{data?.mainDiagnosis || '-'}</Descriptions.Item>
                <Descriptions.Item label="次要诊断">{data?.secondDiagnosis || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions
                title="基线检查"
                bordered
                column={2}
                size="small"
            >
                <Descriptions.Item label="基线检查日期">{formatDate(data?.baseCheckDate)}</Descriptions.Item>
                <Descriptions.Item label="基线检查心超结果" span={2}>{data?.baseCheckResult || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Card title="磁共振记录" size="small">
                <Descriptions
                    bordered
                    column={2}
                    size="small"
                >
                    <Descriptions.Item label="右心室T1 post">{data?.checkMriRightPost || '-'}</Descriptions.Item>
                    <Descriptions.Item label="右心室T1 native">{data?.checkMriRightNative || '-'}</Descriptions.Item>
                    <Descriptions.Item label="血池T1 post">{data?.checkMriBloodPost || '-'}</Descriptions.Item>
                    <Descriptions.Item label="血池T1 native">{data?.checkMriBloodNative || '-'}</Descriptions.Item>
                    <Descriptions.Item label="HCT">{data?.checkMriHct || '-'}</Descriptions.Item>
                    <Descriptions.Item label="ECV">{data?.checkMriEcv || '-'}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Divider />

            <Descriptions
                title="病史信息"
                bordered
                column={3}
                size="small"
            >
                <Descriptions.Item label="过敏史">{formatSwitch(data?.allergyHistory)}</Descriptions.Item>
                <Descriptions.Item label="既往病史">{formatSwitch(data?.medicalHistory)}</Descriptions.Item>
                <Descriptions.Item label="金属植入史">{formatSwitch(data?.metalImplantHistory)}</Descriptions.Item>
            </Descriptions>
        </DraggableModal>
    )
})
