import {SystemInstance} from "@/api/instances.js";

/**
 * 用户登录
 */
export const SystemLogin = data => SystemInstance.post('/login', data);

/**
 * 首页-获取随访日历
 */
export const FollowCalendar = data => SystemInstance.post('/followCalendar', data);