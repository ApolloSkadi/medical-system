import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin } from 'antd';
import { cloneDeep } from 'lodash-es'
import DraggableModal from '@/component/DraggableModal'

export default forwardRef(
    (
        {
            children,
            onSubmit,
            data,
            setData,
            idName = 'id',
            addTitle = '新增',
            editTitle = '编辑',
            okText = '提交',
            modalArgs = {},
            formArgs = {},
            readonly = false,
            onReset
        },
        ref,
    ) => {
        const [formStatus, setFormStatus] = useState('add');
        const [visible, setVisible] = useState(false);
        // 用于还原数据
        const [initData, setInitData] = useState({});
        const [loading, setLoading] = useState(false);
        // 表单对象
        const [form] = Form.useForm();
        // 提交表单
        const submitForm = () => {
            if (loading) return
            form.validateFields().then(() => {
                setLoading(true);
                const formData = form.getFieldsValue(true);
                onSubmit(formData, formStatus === 'edit').finally(() => setLoading(false));
            });
        };
        // 同步字段，初始状态
        const initChangeForm = (formData) => {
            form.setFieldsValue(formData);
            setInitData(cloneDeep(formData));
            const formId = formData[idName];
            setFormStatus(formId === undefined ? 'add' : 'edit');
        };
        // 打开弹出框
        const open = (formData) => {
            initChangeForm(formData);
            const _data = cloneDeep(formData);
            if (data && setData) setData(_data);
            setVisible(true);
        };
        // 监听表单数据改变
        useEffect(() => {
            if (data && Object.keys(data).length) {
                initChangeForm(data);
            }
        }, [data]);
        // 关闭
        const close = () => {
            // 还原表单
            form.setFieldsValue(initData);
            form.resetFields();
            onReset && onReset()
            setVisible(false);
        };
        // 暴露相关方法
        useImperativeHandle(
            ref,
            () => {
                return {
                    open,
                    close,
                    form
                };
            },
            [form],
        );
        // 表单字段变化
        const onValuesChange = (_, newFormData) => {
            if (setData && data) {
                setData(Object.assign({}, data, newFormData));
            }
        };
        return (
            <DraggableModal
                title={formStatus === 'add' ? addTitle : editTitle}
                cancelText="取消"
                okText={okText}
                open={visible}
                onOk={submitForm}
                onCancel={close}
                {
                    ...(readonly ? {
                        footer: false
                    } : {})
                }
                {...modalArgs}
            >
                <Spin tip="提交中..." spinning={loading}>
                    <Form
                        form={form}
                        style={{marginTop: '2rem'}}
                        layout="vertical"
                        onValuesChange={onValuesChange}
                        disabled={readonly}
                        {...formArgs}
                    >
                        {children}
                    </Form>
                </Spin>
            </DraggableModal>
        );
    },
);
