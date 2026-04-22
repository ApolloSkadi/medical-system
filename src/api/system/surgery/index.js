import {SurgeryInstance} from "@/api/instances.js";

// 查询手术记录列表
export const SurgeryPage = data => SurgeryInstance.post("/page", data)
// 手术记录添加修改
export const SurgerySaveOrEdit = data => SurgeryInstance.post("/saveOrEdit", data)
// 手术记录详情
export const SurgeryDetail = data => SurgeryInstance.post("/detail", data)
// 删除手术记录
export const SurgeryDelete = data => SurgeryInstance.post("/delete", data)
