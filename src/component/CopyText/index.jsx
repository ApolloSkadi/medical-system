import { Typography } from 'antd'

export default ({children, value, ...args}) => {
    const copyText = value || children
    return <Typography.Paragraph copyable={copyText ? { text: copyText }: false} {...args} style={{display: 'inline-flex', alignItems: 'center', minWidth: '10em', ...args.style}}>
        {children}
    </Typography.Paragraph>
}
