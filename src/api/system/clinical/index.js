import {ClinicalInstance} from "@/api/instances.js";

// SaaS临床业务接口(按文档第六章生成)
export const SubjectPage = data => ClinicalInstance.post('/subject/page', data);
export const SubjectSaveOrEdit = data => ClinicalInstance.post('/subject/saveOrEdit', data);
export const SubjectDel = data => ClinicalInstance.post('/subject/delete', data);

export const PreInterventionPage = data => ClinicalInstance.post('/preIntervention/page', data);
export const PreInterventionSaveOrEdit = data => ClinicalInstance.post('/preIntervention/saveOrEdit', data);
export const PreInterventionDel = data => ClinicalInstance.post('/preIntervention/delete', data);

export const PbpvPage = data => ClinicalInstance.post('/pbpv/page', data);
export const PbpvSaveOrEdit = data => ClinicalInstance.post('/pbpv/saveOrEdit', data);
export const PbpvDel = data => ClinicalInstance.post('/pbpv/delete', data);

export const EchoPage = data => ClinicalInstance.post('/echo/page', data);
export const EchoSaveOrEdit = data => ClinicalInstance.post('/echo/saveOrEdit', data);
export const EchoDel = data => ClinicalInstance.post('/echo/delete', data);

export const CmrPage = data => ClinicalInstance.post('/cmr/page', data);
export const CmrSaveOrEdit = data => ClinicalInstance.post('/cmr/saveOrEdit', data);
export const CmrDel = data => ClinicalInstance.post('/cmr/delete', data);

export const DrugPage = data => ClinicalInstance.post('/drug/page', data);
export const DrugSaveOrEdit = data => ClinicalInstance.post('/drug/saveOrEdit', data);
export const DrugDel = data => ClinicalInstance.post('/drug/delete', data);

export const HospitalizationPage = data => ClinicalInstance.post('/hospitalization/page', data);
export const HospitalizationSaveOrEdit = data => ClinicalInstance.post('/hospitalization/saveOrEdit', data);
export const HospitalizationDel = data => ClinicalInstance.post('/hospitalization/delete', data);

export const NursingPage = data => ClinicalInstance.post('/nursing/page', data);
export const NursingSaveOrEdit = data => ClinicalInstance.post('/nursing/saveOrEdit', data);
export const NursingDel = data => ClinicalInstance.post('/nursing/delete', data);

export const FollowUpPage = data => ClinicalInstance.post('/followUp/page', data);
export const FollowUpSaveOrEdit = data => ClinicalInstance.post('/followUp/saveOrEdit', data);
export const FollowUpDel = data => ClinicalInstance.post('/followUp/delete', data);

export const SubjectList = data => ClinicalInstance.post('/subject/list', data);

// ==================== 业务附件 ====================
export const ClinicalFileUpload = formData => ClinicalInstance.post('/file/upload', formData, {timeout: 60000});

export const ClinicalFileListByBiz = data => ClinicalInstance.post('/file/listByBiz', data);

export const ClinicalFileDelete = data => ClinicalInstance.post('/file/delete', data);

export const ClinicalFileDownload = data => ClinicalInstance.post('/file/download', data, {responseType: 'blob', timeout: 60000});

// ==================== Excel导入 ====================
export const ClinicalImport = (formData) => ClinicalInstance.post('/import/excel', formData, {timeout: 120000});

// 模板下载: bizType 额外以URL参数传递, 兼容只识别请求参数的旧版后端
export const ClinicalImportTemplate = data => ClinicalInstance.post(
    `/import/template?bizType=${encodeURIComponent(data?.bizType ?? '')}`,
    data,
    {responseType: 'blob', timeout: 60000}
);

// ==================== 首页看板 ====================
export const DashboardStats = data => ClinicalInstance.post('/dashboard/stats', data);
