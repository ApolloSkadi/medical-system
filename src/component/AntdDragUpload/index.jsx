import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { isNotNullArray } from '@/utils/handler.jsx'

export default ({
    fileList,
    accept = ['.xlsx','.xls'],
    onChange,
    ...args
}) => {

    return (
        <Upload.Dragger
            name={'file'}
            fileList={fileList}
            onChange={info => onChange(info.fileList.slice(-1))}
            beforeUpload={() => false}
            {...args}
            accept={accept.join(',')}
        >
            <p className="ant-upload-drag-icon mt-[5rem]">
                <InboxOutlined />
            </p>
            <p className={'ant-upload-text'} style={{ marginBottom: '1.3rem' }}>
                点击或拖拽上传文件
            </p>
            <p className="ant-upload-hint mb-[5rem]">
                {
                    isNotNullArray(accept) ? `仅支持${accept.join('、')}文件类型`: ''
                }
            </p>
        </Upload.Dragger>
    )
};
