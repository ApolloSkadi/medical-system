import AvatarPopover from "@/layout/header/components/AvatarPopover.jsx";
import {useNavigate} from "react-router-dom";
import useAuthStore from "@/store/useAuthStore.js";
export default () => {
    const navigate = useNavigate()
    const userLogout = useAuthStore().logout;

    return (
        <div>
            <div className={'header'}>
                {/* 头像 */}
                <div className={'h-avatar'}>
                    <AvatarPopover
                        onLogout={() => userLogout(navigate)}
                    />
                </div>
            </div>
        </div>
    );
};