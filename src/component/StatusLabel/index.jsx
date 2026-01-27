import {useEffect, useState} from "react";
import {isNotNullArray} from "@/utils/handler.jsx";
import {Badge, Tag} from "antd";

export default ({
    color = 'default',
    type = 'tag',
    children,
    options,
    value,
    ...props
}) => {
    const _color = {
        success: '#52C41A',
        primary: '#2db7f5',
        warning: '#e6a23c',
        error: '#EE3D3D',
        default: '#ccc',
        purple: '#722ed1',
        geekblue: '#2f54eb'
    }
    const [useColor, setUseColor] = useState('')
    const [useChildren, setUseChildren] = useState()
    useEffect(() => {
        if(isNotNullArray(options) && value !== undefined) {
            // 使用选项
            const findItem = options.find(v => v.value === value)
            setUseColor(_color[findItem?.color] ?? 'default')
            setUseChildren(findItem?.label ?? '未知')
        } else {
            setUseColor(_color[color ?? 'default'])
            setUseChildren(children)
        }
    }, [options, value, children]);
    if (type === 'text')
        return (
            <div
                style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}
            >
                <p
                    style={{
                        width: '.8rem',
                        height: '.8rem',
                        borderRadius: '100%',
                        background: useColor,
                        marginRight: '.7rem',
                    }}
                />
                {useChildren ?? '未知'}
            </div>
        );
    if (type==='none') return <>{useChildren ?? '未知'}</>
    if (type === 'badge') {
        return (
            <Badge
                dot
                color={useColor}
                text={useChildren ?? '未知'}
                {...props}
            />
        )
    }
    return (
        <Tag
            color={useColor}
            {...props}
            style={{margin:'0', ...props.style}}
        >
            {useChildren ?? '未知'}
        </Tag>
    )

}