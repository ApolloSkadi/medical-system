import { useState } from 'react';
import { Popconfirm, Button, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default ({
    onConfirm,
    buttonArgs,
    children,
    popconfirmArgs
}) => {
    const [loading, setLoading] = useState(false);
    const deleteConfirm = event => {
        if (loading) return
        setLoading(true);
        onConfirm(event).finally(() => setLoading(false));
    };

    return (
        <Popconfirm
            title="警告"
            description="删除后无法恢复，是否确认删除？"
            okText="确认"
            cancelText="取消"
            onConfirm={deleteConfirm}
            {...popconfirmArgs}
        >
            <div className={'inline-flex'}>
                <Spin spinning={loading}>
                    {
                        children ?? (
                            <Button
                                danger
                                icon={<DeleteOutlined style={{marginLeft: '-.5rem'}} />}
                                iconPosition="end"
                                type="link"
                                style={{padding: '0 .6rem'}}
                                {...buttonArgs}
                            >
                                删除
                            </Button>
                        )}
                </Spin>
            </div>
        </Popconfirm>
    );
};
