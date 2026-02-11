import {PatientInstance, SystemInstance} from "@/api/instances.js";

/**
 * 查询病人信息
 */
export const PatientPage = data => PatientInstance.post('/page', data);
/**
 * 病人信息保存修改
 */
export const PatientSaveOrEdit = data => PatientInstance.post('/saveOrEdit', data);
export const PatientCreate = data => SystemInstance.post('/patient/saveOrEdit', data)
/**
 * 查询病人详情
 */
export const PatientDetail = data => PatientInstance.post('/detail', data);
/**
 * 删除
 */
export const PatientDel = data => PatientInstance.post('/delete',data);
