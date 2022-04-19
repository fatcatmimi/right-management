import { sendAxios } from "./sendAxios";
import { Base } from '../config/memory_config'

//下载
export const downFile = Base + '/web';



//获取资产名称
export const getReturnEquipmentData = (applyStatus, userPersonId, begin, end) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_return_data', { applyStatus, userPersonId, begin, end }, 'GET')

//修改与补录
export const editReturnEquipment = (userPersonId, assetsId, assetsTypeId, applyCenter, workflowId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=fill_insert', { userPersonId, assetsId, assetsTypeId, applyCenter, workflowId }, 'POST')

//归还
export const returnEquipment = (workflowId, optionCenter, stateId = 3) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=update_region', { workflowId, optionCenter, stateId }, 'GET')