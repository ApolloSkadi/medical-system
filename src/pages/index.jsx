import {useOutlet} from "react-router-dom";
import {App, ConfigProvider, theme} from "antd";
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
            {/* App组件使message/modal等静态方法消费主题context，消除antd警告 */}
            <App>
                {currentOutlet}
            </App>
        </ConfigProvider>
    )
}
