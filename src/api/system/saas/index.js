import {SaasInstance} from "@/api/instances.js";

// ==================== 租户管理 ====================
export const TenantPage = data => SaasInstance.post('/tenant/page', data);

export const TenantList = data => SaasInstance.post('/tenant/list', data);

export const TenantSaveOrEdit = data => SaasInstance.post('/tenant/saveOrEdit', data);

export const TenantDel = data => SaasInstance.post('/tenant/delete', data);

// ==================== 租户订阅管理 ====================
export const SubscriptionPage = data => SaasInstance.post('/subscription/page', data);

export const SubscriptionSaveOrEdit = data => SaasInstance.post('/subscription/saveOrEdit', data);

export const SubscriptionDel = data => SaasInstance.post('/subscription/delete', data);

// ==================== 租户模块授权 ====================
export const ModuleGrantPage = data => SaasInstance.post('/moduleGrant/page', data);

export const ModuleGrantSaveOrEdit = data => SaasInstance.post('/moduleGrant/saveOrEdit', data);

export const ModuleGrantDel = data => SaasInstance.post('/moduleGrant/delete', data);

// ==================== 角色管理 ====================
export const RolePage = data => SaasInstance.post('/role/page', data);

export const RoleList = data => SaasInstance.post('/role/list', data);

export const RoleSaveOrEdit = data => SaasInstance.post('/role/saveOrEdit', data);

export const RoleSavePermissions = data => SaasInstance.post('/role/savePermissions', data);

export const RoleDel = data => SaasInstance.post('/role/delete', data);

// ==================== 权限项管理 ====================
export const PermissionPage = data => SaasInstance.post('/permission/page', data);

export const PermissionList = data => SaasInstance.post('/permission/list', data);

export const PermissionSaveOrEdit = data => SaasInstance.post('/permission/saveOrEdit', data);

export const PermissionDel = data => SaasInstance.post('/permission/delete', data);

// ==================== 角色权限(已融合到角色管理，仅保留查询) ====================
export const RolePermissionListByRole = data => SaasInstance.post('/rolePermission/listByRole', data);

// ==================== 用户角色分配 ====================
export const UserRolePage = data => SaasInstance.post('/userRole/page', data);

export const UserRoleUserList = data => SaasInstance.post('/userRole/userList', data);

export const UserRoleSaveOrEdit = data => SaasInstance.post('/userRole/saveOrEdit', data);

export const UserRoleDel = data => SaasInstance.post('/userRole/delete', data);

// ==================== 租户数据源配置 ====================
export const DataSourcePage = data => SaasInstance.post('/dataSource/page', data);

export const DataSourceSaveOrEdit = data => SaasInstance.post('/dataSource/saveOrEdit', data);

export const DataSourceDel = data => SaasInstance.post('/dataSource/delete', data);

export const UserRoleListByUser = data => SaasInstance.post('/userRole/listByUser', data);

export const UserRoleBindRoles = data => SaasInstance.post('/userRole/bindRoles', data);
