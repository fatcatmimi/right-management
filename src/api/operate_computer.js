import { sendAxios } from "./sendAxios";
import { Base } from '../config/memory_config'

//资产领用获取
export const getUseDataApi = (startDate, endDate, receivePersonId, userPersonId, optionPersonId, assetNumbers, VPNAccount, optionCenter, begin, end) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=get_use_data', { startDate, endDate, receivePersonId, userPersonId, optionPersonId, assetNumbers, VPNAccount, optionCenter, begin, end }, 'GET')
//获取地点
export const getCompanyRegion = (projectId) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=get_company_region', { projectId }, 'GET')
//新增领用
export const insertComputerUse = (projectId, assetNumbers, assetsId, assetsTypeId, receivePersonId, userPersonId, optionCenter, VPNAccount, remark) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=insert_computer_use', { projectId, assetNumbers, assetsId, assetsTypeId, receivePersonId, userPersonId, optionCenter, VPNAccount, remark }, 'POST')
//删除
export const deleteComputerData = (type, id) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=delete_computer_data', { type, id }, 'GET');
//归还
export const insertComputerBack = (id, returnPersonId, VPNAccountRecovery, remark) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=insert_computer_back', { id, returnPersonId, VPNAccountRecovery, remark }, 'GET');

//查询资产编号
export const getComputerAssetNumbers = (assetNumbers) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=get_computer_assetNumbers', { assetNumbers }, 'GET');
//资产归还获取
export const getBackDataApi = (startDate, endDate, returnPersonId, userPersonId, optionPersonId, assetNumbers, VPNAccountRecovery, begin, end) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=get_back_data', { startDate, endDate, returnPersonId, userPersonId, optionPersonId, assetNumbers, VPNAccountRecovery, begin, end }, 'GET')
//修改VPN状态
export const updateComputerVPNApi = (id, VPNAccountRecovery) => sendAxios(Base + '/interface/asynRead_operate_computer.php?cmd=update_computer_vpn', { id, VPNAccountRecovery }, 'GET')