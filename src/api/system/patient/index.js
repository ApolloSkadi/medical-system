import {PatientInstance} from "@/api/instances.js";

/**
 * 查询病人信息
 */
export const PatientPage = data => PatientInstance.post('/page', data);