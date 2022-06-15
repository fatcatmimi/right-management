import { sendAxios } from "./sendAxios";
import { Base } from '../config/memory_config'

//获取
export const getApprovalEquipment = (applyStatus, begin, end) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_lose_review', { applyStatus, begin, end }, 'GET');

//同意
export const updateApprovalEquipment = (workflowId, stateId, cmd) => sendAxios(Base + `/interface/asynRead_reg_headphone.php?cmd=${cmd}`, { workflowId, stateId }, 'GET');
