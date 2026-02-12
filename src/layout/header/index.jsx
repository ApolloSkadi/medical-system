import AvatarPopover from "@/layout/header/components/AvatarPopover.jsx";
import {useNavigate} from "react-router-dom";
import useAuthStore from "@/store/useAuthStore.js";
import PwdChangeModal from "@/layout/header/components/PwdChangeModal/index.jsx";
import {useRef, useState} from "react";
import {message} from "antd";
import {EditUser} from "@/api/system/user/index.js";
export default () => {
    const navigate = useNavigate()
    const userLogout = useAuthStore().logout;
    // 修改密码
    const pwdFormRef = useRef()
    const [pwdForm, setPwdForm] = useState();
    // 修改密码方法
    const pwdSubmit = (data) => {
        return EditUser(data).then((res)=>{
            message.success(res.data)
            message.success('请重新登录')
            pwdFormRef.current?.close()
            userLogout(navigate)
        })
    }

    return (
        <div>
            <div className={'header'}>
                {/* 头像 */}
                <div className={'h-avatar'}>
                    <AvatarPopover
                        onLogout={() => userLogout(navigate)}
                        onEditPassword={() => pwdFormRef.current?.open({})}
                    />
                    <PwdChangeModal
                        form={pwdForm}
                        setForm={setPwdForm}
                        ref={pwdFormRef}
                        onSubmit={pwdSubmit}
                    />
                </div>
            </div>
        </div>
    );
};