import { Space, Button } from 'antd'
import { useState } from 'react'
import {PlusOutlined} from "@ant-design/icons";

export default ({ onSearch, onReset, onExport, onImport, onAdd,children }) => {
    const [searchLoading, setSearchLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [exportLoading, setExportLoading] = useState(false)
    const [importLoading, setImportLoading] = useState(false)
    const [addLoading, setAddLoading] = useState(false)

    return (
        <Space>
            <Button type={'primary'} onClick={() => {
                setSearchLoading(true)
                onSearch().finally(() => setSearchLoading(false))
            }} loading={searchLoading}>查询</Button>
            {
                onReset &&
                <Button onClick={() => {
                    setResetLoading(true)
                    onReset().finally(() => setResetLoading(false))
                }} loading={resetLoading}>重置</Button>
            }
            {
                onExport &&
                <Button onClick={() => {
                    setExportLoading(true)
                    onExport().finally(() => setExportLoading(false))
                }} loading={exportLoading}>导出</Button>
            }
            {
                onImport &&
                <Button onClick={() => {
                    setImportLoading(true)
                    onImport().finally(() => setImportLoading(false))
                }} loading={importLoading}>导入</Button>
            }
            {
                onAdd &&
                <Button type={'primary'} icon={<PlusOutlined />} onClick={onAdd}>新增</Button>
            }
            {children}
        </Space>
    )
}
