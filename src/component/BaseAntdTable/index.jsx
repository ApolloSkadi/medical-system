import { Table } from 'antd';
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';

let apiVersion = {}
export default forwardRef(
    (
        {
            api,
            apiData,
            filter,
            valid,
            initPageSize = 10,
            initCurrent = 1,
            paginationOptions = {},
            notIsNull = false,
            autoInit = true,
            ...args
        },
        ref,
    ) => {
        const [pageSize, setPageSize] = useState(initPageSize);
        const [current, setCurrent] = useState(initCurrent);
        const [total, setTotal] = useState(0);
        const [loading, setLoading] = useState(false);
        const [tableData, setTableData] = useState([]);
        let isMounted = true;

        const getTableData = ({
            page = current,
            limit = pageSize,
            data = apiData,
            otherData = {}
        } = {}) => {
            if (valid && !valid()) return;
            setLoading(true);
            // 记录下请求时未改变的页码
            const _current = current;
            const _activePageSize = pageSize;
            const prevVersion = apiVersion[api.toString()]
            const activeVersion = (prevVersion ?? 0) + 1
            apiVersion[api.toString()] = activeVersion
            return api({
                pageSearch: {
                    limit,
                    page,
                },
                ...Object.assign({}, data, otherData),
            }).then(res => {
                if (
                    _current === current &&
                    _activePageSize === pageSize &&
                    isMounted &&
                    activeVersion === apiVersion[api.toString()]
                ) {
                    if (filter) res = filter(res);

                    // 处理响应格式：可能是ResponseInfo对象或直接数据
                    let responseData = res;
                    let totalCount = 0;

                    // 如果是ResponseInfo对象
                    if (res && res.code !== undefined) {
                        if (res.code !== 'OK') {
                            // 接口返回失败
                            setTotal(0);
                            setTableData([]);
                            return;
                        }
                        responseData = res.data;
                        totalCount = res.count ?? 0;
                    }

                    // 处理分页数据：responseData可能是PageResult对象（包含total和rows）或直接数组
                    let tableData = responseData ?? [];

                    // 如果responseData是PageResult对象（包含total和rows）TODO 对接你自己的接口参数名称，让你用FAntdTable不用，然后自己也不改。。。。
                    if (tableData && typeof tableData === 'object' && tableData.list !== undefined) {
                        totalCount = tableData.total ?? totalCount;
                        tableData = tableData.list ?? [];
                    }

                    setTotal(totalCount);
                    setTableData(tableData);
                }
            }).catch(() => {
                setTotal(0);
                setTableData([]);
            }).finally(() => {
                setCurrent(page);
                setPageSize(limit);
                isMounted && setLoading(false)
            });
        };
        // 还原页数查询
        const initPageSearch = otherData => getTableData({
            page: initCurrent,
            limit: pageSize,
            otherData,
        })
        // 重置查询（还原页数和条数和空查询）
        const resetPageSearch = otherData => getTableData({
            page: initCurrent,
            limit: initPageSize,
            data: {},
            otherData,
        })

        useImperativeHandle(
            ref,
            () => {
                return {
                    getTableData,
                    initPageSearch,
                    resetPageSearch,
                };
            },
            [current, pageSize, apiData],
        );
        useEffect(() => {
            autoInit && getTableData();
            return () => {
                isMounted = false;
            };
        }, []);
        return (notIsNull && !total) ?
            <></> :
            <Table
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    current,
                    pageSize,
                    total,
                    pageSizeOptions: [5, 10, 20, 50],
                    onChange: (_current, _pageSize) => {
                        getTableData({
                            page: _current,
                            limit: _pageSize,
                        })
                    },
                    ...paginationOptions,
                }}
                dataSource={tableData}
                {...args}
            />
    },
);
