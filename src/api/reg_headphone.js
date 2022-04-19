import { sendAxios, sendAxios_formData } from "./sendAxios";
import { Base } from '../config/memory_config'

//下载
export const downFile = Base + '/web';



//获取资产名称
export const getAssertName = (projectId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_assert_name', { projectId }, 'GET')
//获取资产类别
export const getAssertType = (assetsId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_assert_type', { assetsId }, 'GET')
//获取batchid
export const getBatchId = (projectId, applyStatus, type = 1) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_batchId', { projectId, applyStatus, type }, 'GET')
//获取数据
export const getEquipmentData = (projectId, applyStatus, batchId, type, stateId = -1, begin = 1, end = 10) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_data', { projectId, applyStatus, batchId, type, stateId, begin, end }, 'GET')
//删除
export const deleteBatchId = (projectId, batchId, stateId = 1) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=del_batchId', { projectId, batchId, stateId }, 'GET')
//更新地区
export const updateRegion = (projectId, batchId, optionCenter, workflowId, stateId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=update_region', { projectId, batchId, optionCenter, workflowId, stateId }, 'GET')
//驳回
export const rejectReason = (projectId, batchId, optionRemark, workflowId, stateId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=reject', { projectId, batchId, optionRemark, workflowId, stateId}, 'GET')



//丢失领用获原申请信息
export const getOldMissInfo = (assetsId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_original_data', { assetsId }, 'GET')
//丢失领用提交
export const submitMissInfo = (assetsId, assetsTypeId, newAssetsTypeId, applyRemark, relationId = -1, cmd = 'lose_insert') => sendAxios(Base + `/interface/asynRead_reg_headphone.php?cmd=${cmd}`, { assetsId, assetsTypeId, newAssetsTypeId, applyRemark, relationId }, 'POST')
//丢失领用获取数据
export const getMissInfo = (applyStatus = -1, cmd) => sendAxios(Base + `/interface/asynRead_reg_headphone.php?cmd=${cmd}`, { applyStatus }, 'GET')
//删除丢失领用数据
export const deleteMissInfo = (workflowId, stateId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=del_batchId', { workflowId, stateId }, 'GET')


//上传文件
export const uploadFileHeadPhone = (formData) => sendAxios_formData(Base + '/interface/asynRead_reg_headphone.php?cmd=apply', formData)
