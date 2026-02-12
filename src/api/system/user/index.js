import {UserInstance} from "@/api/instances.js";

export const CreateUserInfo = data => UserInstance.post("/createUser", data)

export const UserPage = data => UserInstance.post('/page', data)

export const EditUser = data => UserInstance.post("/editUser", data);