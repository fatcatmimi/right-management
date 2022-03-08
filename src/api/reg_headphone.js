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
export const getEquipmentData = (projectId, batchId, type, begin = 1, end = 10) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=get_data', { projectId, batchId, type, begin, end }, 'GET')
//删除
export const deleteBatchId = (projectId, batchId) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=del_batchId', { projectId, batchId }, 'GET')
//更新地区
export const updateRegion = (projectId, batchId, optionCente) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=update_region', { projectId, batchId, optionCente }, 'GET')
//驳回
export const rejectReason = (projectId, batchId, optionRemark) => sendAxios(Base + '/interface/asynRead_reg_headphone.php?cmd=reject', { projectId, batchId, optionRemark }, 'GET')


//上传文件
export const uploadFileHeadPhone = (formData) => sendAxios_formData(Base + '/interface/asynRead_reg_headphone.php?cmd=apply', formData)