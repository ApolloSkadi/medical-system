import { Select } from 'antd';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { cloneDeep } from 'lodash-es'

const sendDataCache = new Map();

let time
const inputChange = (value, cb) => {
    clearTimeout(time);
    time = setTimeout(() => {
        cb(value);
        clearTimeout(time);
        time = undefined;
    }, 1500);
}
export default ({
    api,
    data,
    callback,
    defaultOne,
    value,
    setValue,
    filter,
    valid,
    onChange,
    apiData,
    initSearch,
    onSearch: _onSearch,
    searchMode,
    filterDeps = [],
    searchName,
    labelName = 'label',
    valueName = 'value',
    ...args
}) => {
    const [selectOptions, setSelectOptions] = useState([]);
    const bakSelectOptions = useRef([])
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);
    // 当前选中label
    const activeSearch = useRef(initSearch)
    const prevSendData = useMemo(
        () => ({
            current: Math.random(),
        }),
        [],
    );

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const setData = (data) => {
        const _data = cloneDeep(handleData(data));
        setSelectOptions(_data);
        if (defaultOne && _data.length && value === undefined) {
            setValue && setValue(_data[0].value);
        }
    };

    const handleData = (_data) => {
        bakSelectOptions.current = _data
        return _data
            ? (filter ? filter(_data) : _data).map((v) => ({
                label: v[labelName],
                value: v[valueName],
                ...v,
            }))
            : [];
    };

    // 创建一个定时器，移除指定api和请求参数的缓存结果
    const createRemoveTimeout = (api, cKey) => {
        // 10秒刷新
        setTimeout(() => {
            if (sendDataCache.has(api) && sendDataCache.get(api).has(cKey)) {
                sendDataCache.get(api).delete(cKey);
            }
        }, 10000);
    };
    // 创建缓存
    const setDataCache = (api, cKey, promise) => {
        if (sendDataCache.has(api)) {
            sendDataCache.get(api).set(cKey, promise);
        } else {
            const _map = new Map();
            _map.set(cKey, promise);
            sendDataCache.set(api, _map);
        }
        createRemoveTimeout(api, cKey);
    };
    // 查询缓存
    const getDataCache = (api, cKey) => {
        let result;
        if (sendDataCache.has(api) && sendDataCache.get(api).has(cKey)) {
            result = sendDataCache.get(api).get(cKey);
        }
        return result;
    };

    const promiseThen = (res) => {
        callback && callback(res);
        if (isMounted.current) {
            // 处理系统接口响应格式（ResponseInfo对象）
            if (res && res.code !== undefined) {
                // 这是ResponseInfo对象
                if (res.code !== 'OK') throw new Error('接口返回失败！');
                setData(res.data);
            } else {
                // 这是直接的数据
                setData(res);
            }
        }
        return res;
    };
    // 获取选项数据
    const getOptions = useCallback((searchLabel = initSearch) => {
        if (valid && !valid()) return;
        if (data) return setData(data);
        const baseBody = apiData ?? {}
        let sendOtherData = {}
        // 动态搜索，添加搜索label
        if (searchMode) {
            sendOtherData[searchName ?? labelName] = searchLabel
        }
        const sendData = {
            ...baseBody,
            ...sendOtherData
        }
        const cacheDataPromise = getDataCache(api, JSON.stringify(sendData));
        if (cacheDataPromise) return cacheDataPromise.then(promiseThen);
        setLoading(true);
        const apiPromise = api(sendData);
        setDataCache(api, JSON.stringify(sendData), apiPromise);
        apiPromise.then(promiseThen).finally(() => setLoading(false));
    }, [apiData, prevSendData, value, activeSearch.current, valid]);

    useEffect(() => {
        if (filterDeps.length > 0 && filter)
            setData(bakSelectOptions.current ?? []);
    }, [filterDeps, filter]);

    useEffect(() => {
        getOptions(undefined)
    }, [apiData]);

    useEffect(() => {
        setData(data)
    }, [data]);

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    return (
        <Select
            loading={loading}
            value={value}
            onChange={(_value, _data) => {
                activeSearch.current = _data?.label ?? ''
                onChange && onChange(_value);
                setValue && setValue(_value);
            }}
            {
                ...(
                    searchMode ? {
                        onSearch: value => {
                            inputChange(value, getOptions)
                            _onSearch && _onSearch(value)
                        },
                        filterOption: false
                    }: {
                        onSearch: _onSearch,
                        filterOption,
                    }
                )
            }
            showSearch
            onClear={() => {
                if (searchMode) getOptions('')
            }}
            placeholder={setValue ? '全部数据' : '请选择'}
            allowClear
            options={selectOptions}
            {...args}
        />
    );
};
