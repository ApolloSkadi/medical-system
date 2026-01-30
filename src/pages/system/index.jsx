import {Outlet, useOutlet} from "react-router-dom";
import MainLayout from "@/layout/MainLayout.jsx";
import RouteGuard from "@/router/RouteGuards";

const MyComponent = () => {
    const currentOutlet = useOutlet()
    return (
        <MainLayout>
            <RouteGuard>
                {currentOutlet}
                {/*<Outlet/>*/}
            </RouteGuard>
        </MainLayout>

    )
}
export default MyComponent