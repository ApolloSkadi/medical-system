import useAuthStore from "@/store/useAuthStore.js";
import {message} from "antd";

// 请求拦截器
export const baseBeforeFilter = req => {
    console.log('url', req.url)
    if (req.url !== '/login') {
        // 使用 zustand 的 getState() 方法在组件外部获取状态
        const authState = useAuthStore.getState()
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
    // 文件流(blob)响应时 data 即文件本身
    return resp.data;
})

// 是否文件流(导出/模板下载)响应
const isBlobData = data => typeof Blob !== 'undefined' && data instanceof Blob;

// 系统接口响应拦截器

export const baseErrorHandle = ({code, message: respMsg, response: resp}) => {
    // 构建错误返回
    const createErrorReturn = _msg => Promise.reject(_msg ?? '操作失败').catch(err => {
        message.error(err)
        return Promise.reject(err)
    })
    // 请求超时异常
    if (code === 'ECONNABORTED' || respMsg === 'Network Error' || respMsg?.includes('timeout')) return createErrorReturn('网络请求超时');
    // 文件流响应: 正常文件直接放行(由响应拦截器返回blob本体);
    // 后端异常时会以json返回错误信息, 需要读取文本后提示, 避免把错误信息当成文件下载
    if (isBlobData(resp?.data)) {
        const contentType = resp.data.type || '';
        if (!contentType.includes('json')) return false;
        return resp.data.text().then(text => {
            let failMsg = '文件下载失败，请稍后重试';
            try {
                const body = JSON.parse(text);
                failMsg = body?.msg || body?.message || failMsg;
            } catch (e) {
                // 非JSON内容: 使用默认提示
            }
            return createErrorReturn(failMsg);
        });
    }
    // 处理正确响应内容
    console.log('resp', resp)
    if (!resp.data.code) return resp
    const apiRespData = resp.data;
    // token 过期处理
    if (apiRespData.code === 'UNLOGIN') {
        message.config({maxCount: 1});
        message.error('登录过期，请重新登录', 1, () => {
            localStorage.removeItem("autoLogin")
            window.location.href = '/login';
        })
        return Promise.reject(apiRespData.msg)
    }
    // 其他错误
    if (apiRespData.code !== 'OK' && apiRespData.code !== 200 && apiRespData.code !== '200') return createErrorReturn(apiRespData.msg)
    return false
}
