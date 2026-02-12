import {UserInstance} from "@/api/instances.js";

export const CreateUser = data => UserInstance.post("/createUser", data);

export const UserPage = data => UserInstance.post('/page', data)

