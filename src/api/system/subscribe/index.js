import {SubscribeInstance} from "@/api/instances.js";

export const SubscribePage = data => SubscribeInstance.post('/page', data);

export const SubscribeSaveOrEdit = data => SubscribeInstance.post('/saveOrEdit', data);

export const SubscribeTest = data => SubscribeInstance.post('/test', data);

export const SubscribeDel = data => SubscribeInstance.post('/delete', data);