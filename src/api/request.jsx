import useAuthStore from "@/store/useAuthStore.js";
import {message} from "antd";

// 请求拦截器
export const baseBeforeFilter = req => {
    console.log('url', req.url)
    if (req.url !== '/login') {
        // 使用 zustand 的 getState() 方法在组件外部获取状态
        const authState = useAuthStore.getState()
        console.log('authState', authState?.token)
        req.headers.token = authState?.token || ''
    }
    if (!req.data) req.data = {};
    if (!req.params) req.params = {};
    console.log('接口执行 req', req)
    return req;
}
// 通用响应拦截器
export const baseAfterFilter = (resp => {
    const errorPromise = baseErrorHandle({
        response: resp
    })
    if (errorPromise) return errorPromise
    // 返回后端响应中的 data 字段（实际业务数据）
    return resp.data;
})

// 系统接口响应拦截器

export const baseErrorHandle = ({code, message: respMsg, response: resp}) => {
    // 构建错误返回
    const createErrorReturn = _msg => Promise.reject(_msg ?? '操作失败').catch(err => {
        message.error(err)
        return Promise.reject(err)
    })
    // 请求超时异常
    if (code === 'ECONNABORTED' || respMsg === 'Network Error' || respMsg?.includes('timeout')) return createErrorReturn('网络请求超时');
    // 处理正确响应内容
    console.log('resp', resp)
    const apiRespData = resp.data;
    // token 过期处理
    if (apiRespData.code === 'UNLOGIN') {
        message.config({maxCount: 1});
        message.error('登录过期，请重新登录', 1, () => {
            window.location.href = '/login';
        })
        return Promise.reject(apiRespData.msg)
    }
    // 其他错误
    if (apiRespData.code !== 'OK' && apiRespData.code !== 200 && apiRespData.code !== '200') return createErrorReturn(apiRespData.msg)

}
