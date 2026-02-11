import {PatientInstance} from "@/api/instances.js";

/**
 * 查询病人信息
 */
export const PatientPage = data => PatientInstance.post('/page', data);

export const PatientDetail = data => PatientInstance.post('/detail', data);