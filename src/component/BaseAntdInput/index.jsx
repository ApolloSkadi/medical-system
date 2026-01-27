import { Input, InputNumber } from 'antd';
import { useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { copyText } from '@/utils/handler.jsx'
import Decimal from "decimal.js";

// step={1} precision={0} min={1}
// strict：数字输入框，严格模式（限制最小值为0， 步长为1，且不保留小数）
let time
const searchInputChange = (value, cb) => {
    clearTimeout(time);
    time = setTimeout(() => {
        cb(value);
        clearTimeout(time);
        time = undefined;
    }, 500);
}
export default forwardRef(({
    value,
    setValue = value => {
    },
    copy,
    type,
    inputStyles = {},
    onChange = (value, ...args) => {
    },
    onSearch,
    autoSearch = true,
    strict,
    price,
    percentage,
    ...args
}, ref) => {
    const handleDoubleClick = () => {
        if (value !== undefined && copy) {
            copyText(value)
        }
    };
    // 搜索
    const [searchLoading, setSearchLoading] = useState(false)
    const _onSearch = value => {
        if (searchLoading) return
        setSearchLoading(true)
        onSearch && onSearch(value).finally(() => setSearchLoading(false))
    }

    const inputRef = useRef()
    useImperativeHandle(ref, () => {
        return {
            ref: inputRef
        }
    }, [inputRef])

    // 格式化输入值（去除输入框左右多余空格） tip trim格式化输入框两侧空格
    const handleChange = (tip, value, ...changeArgs) => {
        let targetValue = value
        if (tip === 'trim') targetValue = value?.trim()
        if (tip === 'autoSearch') searchInputChange(value, _onSearch)
        onChange && onChange(targetValue, ...changeArgs)
        setValue && setValue(targetValue)
    }
    const NumberInput = (
        <InputNumber
            ref={inputRef}
            value={value}
            onChange={(value, ...changeArgs) => handleChange(undefined, value, ...changeArgs)}
            {...(strict
                ? {
                    step: 1,
                    precision: 0,
                    min: 1,
                }
                : {})}
            {...(price
                ? {
                    step: 1,
                    formatter (value) {
                        return value?.replace('￥', '') === '' ? undefined : `￥${value}`
                    },
                    parser (value) {
                        // 最多支持小数点后四位
                        const decimalTarget = value?.replace('￥', '')
                        if (decimalTarget === '' || decimalTarget === undefined || decimalTarget === 'undefined') return undefined
                        return +new Decimal(decimalTarget).toFixed(4)
                    }
                }
                : {})}
            {...(percentage
                ? {
                    step: 1,
                    formatter (value) {
                        return value?.replace('%', '') === '' ? undefined : `${value}%`
                    },
                    parser (value) {
                        // 最多支持小数点后两位
                        const decimalTarget = value?.replace('%', '')
                        if (decimalTarget === '' || decimalTarget === undefined || decimalTarget === 'undefined') return undefined
                        return +new Decimal(decimalTarget).toFixed(2)
                    }
                }
                : {})}
            placeholder="请输入"
            allowClear
            onDoubleClick={handleDoubleClick}
            {...args}
            style={{ width: '100%', ...inputStyles }}
        />
    )
    const BaseInput = (
        <Input
            value={value}
            onChange={(event, ...changeArgs) => handleChange('trim', event.target.value, ...changeArgs)}
            placeholder="请输入"
            allowClear
            ref={inputRef}
            onDoubleClick={handleDoubleClick}
            {...args}
            style={{ minWidth: '15rem', ...inputStyles }}
        />
    )
    const PasswordInput = (
        <Input.Password
            ref={inputRef}
            value={value}
            onChange={(event, ...changeArgs) => handleChange('trim', event.target.value, ...changeArgs)}
            placeholder="请输入密码"
            allowClear
            onDoubleClick={handleDoubleClick}
            {...args}
            style={{ minWidth: '15rem', ...inputStyles }}
        />
    )
    const SearchInput = (
        <Input.Search
            ref={inputRef}
            value={value}
            onChange={(event, ...changeArgs) => handleChange(autoSearch ? 'autoSearch': undefined, event.target.value, ...changeArgs)}
            placeholder={autoSearch ? '输入后自动搜索' : '请输入'}
            loading={searchLoading}
            allowClear
            onSearch={_onSearch}
            {...args}
            style={{ minWidth: '15rem', ...inputStyles }}
        />
    )
    if (type === 'number' || price || strict || percentage) return NumberInput
    if (type === 'password') return PasswordInput
    if (type === 'search') return SearchInput
    return BaseInput
});
