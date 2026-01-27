import {Layout} from "antd";
import SideSystem from "./side"
import HeaderSystem from './header'

const {Content} = Layout;
export default ({children}) => {
    return (
        <>
            <Layout>
                <SideSystem/>
                <Layout>
                    <HeaderSystem/>
                    <Content>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};