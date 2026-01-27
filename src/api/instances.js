import {baseAfterFilter, baseBeforeFilter, baseErrorHandle} from "@/api/request.js";
import axios from "axios";

const defaultBaseOptions = {
    timeout: 6000
}
// 创建一个axios请求对象
const createAxiosInstance = (baseOptions, {
    beforeFilter,
    afterFilter,
    errorHandle
} = {}) => {
    const axiosInstance = axios.create({
        ...defaultBaseOptions,
        ...baseOptions,
    })
    // 添加响应和拦截器
    axiosInstance.interceptors.request.use(beforeFilter ?? baseBeforeFilter)
    axiosInstance.interceptors.response.use(afterFilter ?? baseAfterFilter, axiosError => (errorHandle ?? baseErrorHandle)(axiosError))
    return axiosInstance
}

// 系统接口
export const SystemInstance = createAxiosInstance({baseURL: '/system'})
// 用户接口
export const UserInstance = createAxiosInstance({baseURL: '/user'})
// 病人接口
export const PatientInstance = createAxiosInstance({baseURL: '/patient'})
