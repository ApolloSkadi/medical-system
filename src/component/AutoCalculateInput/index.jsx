import {Form} from "antd";
import {useEffect, useMemo} from "react";
import Decimal from "decimal.js";
import BaseAntdInput from "@/component/BaseAntdInput/index.jsx";

const isBlank = value => value === undefined || value === null || value === '';
const normalizeValue = value => isBlank(value) ? undefined : value;

export default ({
    name,
    watchNames = [],
    calculate,
    precision = 2,
    setFormData,
    inputProps = {},
    value,
    onChange,
}) => {
    const form = Form.useFormInstance();

    // Antd 的 selector 监听在部分版本/场景下不会稳定触发表单重算。
    // 这里固定监听前 5 个字段，当前自动计算项只需要 2 个字段，后续也能复用。
    const watchValue0 = Form.useWatch(watchNames[0] ?? '__auto_calculate_unused_0__', form);
    const watchValue1 = Form.useWatch(watchNames[1] ?? '__auto_calculate_unused_1__', form);
    const watchValue2 = Form.useWatch(watchNames[2] ?? '__auto_calculate_unused_2__', form);
    const watchValue3 = Form.useWatch(watchNames[3] ?? '__auto_calculate_unused_3__', form);
    const watchValue4 = Form.useWatch(watchNames[4] ?? '__auto_calculate_unused_4__', form);

    const values = useMemo(() => {
        const watchedValues = [watchValue0, watchValue1, watchValue2, watchValue3, watchValue4];
        return watchNames.map((fieldName, index) => normalizeValue(watchedValues[index]) ?? form.getFieldValue(fieldName));
    }, [form, watchNames, watchValue0, watchValue1, watchValue2, watchValue3, watchValue4]);
    const valuesKey = values.map(value => isBlank(value) ? '' : value).join('|');

    useEffect(() => {
        if (!watchNames.length || values.some(isBlank)) {
            if (!isBlank(form.getFieldValue(name))) {
                form.setFieldValue(name, undefined);
                setFormData?.(data => ({
                    ...data,
                    [name]: undefined
                }));
            }
            return;
        }

        try {
            const result = calculate(values.map(value => new Decimal(value)));
            const nextValue = result === undefined || result === null || !Decimal.isDecimal(result)
                ? undefined
                : Number(result.toFixed(precision));
            if (form.getFieldValue(name) !== nextValue) {
                form.setFieldValue(name, nextValue);
                setFormData?.(data => ({
                    ...data,
                    [name]: nextValue
                }));
            }
        } catch (e) {
            if (!isBlank(form.getFieldValue(name))) {
                form.setFieldValue(name, undefined);
                setFormData?.(data => ({
                    ...data,
                    [name]: undefined
                }));
            }
        }
    }, [calculate, form, name, precision, setFormData, values, valuesKey, watchNames.length]);

    return (
        <BaseAntdInput
            float
            value={value}
            onChange={onChange}
            {...inputProps}
        />
    )
}
