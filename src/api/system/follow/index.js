import {FollowInstance} from "@/api/instances.js";
// 查询随访列表
export const FollowPage = data => FollowInstance.post("/page", data)
// 随访信息添加修改
export const FollowSaveOrEdit = data => FollowInstance.post("/saveOrEdit", data)
// 修改随访状态
export const FollowChangeStatus = data => FollowInstance.post("/changeStatus", data)
// 删除
export const FollowDelete = data => FollowInstance.post("/delete", data)