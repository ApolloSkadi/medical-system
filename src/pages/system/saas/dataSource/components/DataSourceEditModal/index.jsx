import {forwardRef} from "react";
import BaseFormModal from "@/component/BaseFormModal/index.jsx";
import {Col, Form, Row, Input} from "antd";
import {FAntdInput} from "izid";
import BaseAntdSelect from "@/component/BaseAntdSelect/index.jsx";
import Constant from "@/utils/Constant.jsx";
import {easyNotNull} from "@/utils/antd-validator.js";
import {TenantList} from "@/api/system/saas/index.js";
import {jsonValidator} from "@/pages/system/saas/common.js";

export default forwardRef(({
    formData,
    setFormData,
    onSubmit
}, ref) => {
    return (
        <BaseFormModal
            ref={ref}
            data={formData}
            setData={setFormData}
            addTitle={'新增数据源'}
            editTitle={'编辑数据源'}
            onSubmit={onSubmit}
        >
            <Form.Item label={'所属租户'} name={'tenantId'} rules={easyNotNull('所属租户')}>
                <BaseAntdSelect
                    api={TenantList}
                    labelName={'tenantName'}
                    valueName={'id'}
                />
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label={'数据源名称'} name={'sourceName'} rules={easyNotNull('数据源名称')}>
                        <FAntdInput placeholder={'如：XX医院HIS导出'}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'来源类型'} name={'sourceType'} rules={easyNotNull('来源类型')}>
                        <BaseAntdSelect data={Constant.SourceTypeOptions}/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label={'导入模板版本号'} name={'templateVersion'}>
                <FAntdInput/>
            </Form.Item>
            <Form.Item
                label={'字段映射配置(JSON)：源字段→标准字段'}
                name={'fieldMappingJson'}
                rules={[jsonValidator('字段映射配置')]}
            >
                <Input.TextArea rows={4} placeholder={'如：{"患儿姓名":"name","联系电话":"phone"}'}/>
            </Form.Item>
            <Form.Item
                label={'枚举值映射配置(JSON)：源枚举→标准枚举'}
                name={'enumMappingJson'}
                rules={[jsonValidator('枚举值映射配置')]}
            >
                <Input.TextArea rows={4} placeholder={'如：{"男":"M","女":"F"}'}/>
            </Form.Item>
            <Form.Item
                label={'单位换算配置(JSON)'}
                name={'unitMappingJson'}
                rules={[jsonValidator('单位换算配置')]}
            >
                <Input.TextArea rows={4} placeholder={'如：{"weight":{"from":"g","to":"kg","rate":0.001}}'}/>
            </Form.Item>
            <Form.Item label={'状态'} name={'status'} rules={easyNotNull('状态')}>
                <BaseAntdSelect data={Constant.StartCloseOptions}/>
            </Form.Item>
        </BaseFormModal>
    )
})
