import {PatientInstance, SystemInstance} from "@/api/instances.js";

/**
 * 查询病人信息
 */
export const PatientPage = data => SystemInstance.post('/patient/page', data);
/**
 * 查询病人详情
 */
export const PatientDetail = data => SystemInstance.post('/patient/detail', data);
/**
 * 病人信息保存修改
 */
export const PatientSaveOrEdit = data => SystemInstance.post('/patient/saveOrEdit', data);