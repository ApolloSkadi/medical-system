import {PatientInstance} from "@/api/instances.js";

/**
 * 查询病人信息
 */
export const PatientPage = data => PatientInstance.post('/page', data);
/**
 * 病人信息保存修改
 */
export const PatientSaveOrEdit = data => PatientInstance.post('/saveOrEdit', data);
/**
 * 查询病人详情
 */
export const PatientDetail = data => PatientInstance.post('/detail', data);
/**
 * 删除
 */
export const PatientDel = data => PatientInstance.post('/delete',data);
/**
 * 导入病人信息
 */
export const ImportPatient = data => PatientInstance({
    url:"/import",
    method:'post',
    headers:{'Content-Type':'multipart/form-data'},
    data
})
/**
 * 导出病人信息
 */
export const ExportPatient = data => PatientInstance({
    url:'/exportPatient',
    method:'post',
    responseType:'blob',
    data
});