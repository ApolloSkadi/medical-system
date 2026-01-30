import {useOutlet} from "react-router-dom";
import {ConfigProvider, theme} from "antd";
import zhCN from "antd/lib/locale/zh_CN";

export default () => {
    const currentOutlet = useOutlet()
    const systemThemeWrapper = {
        'dark': 'darkAlgorithm',
        'default': 'defaultAlgorithm',
    }
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: theme[systemThemeWrapper]
            }}
        >
            {currentOutlet}
        </ConfigProvider>
    )
}