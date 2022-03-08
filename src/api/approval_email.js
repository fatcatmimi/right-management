import {sendAxios} from "./sendAxios";
import {Base} from '../config/memory_config'

//获取
export const getApprovalMailApi = (statusId,projectId,startDate,endDate,begin,end) =>sendAxios(Base + '/interface/asynRead.php?cmd=get_approval_mail',{statusId,projectId,startDate,endDate,begin,end},'GET')

//获取操作人
export const getApprovalOperatePersonList = (projectId) => sendAxios(Base + '/interface/asynRead.php?cmd=get_approval_personList',{projectId},'GET')

//获取特权人
export const getApprovalPrivilegePersonList = (projectId) => sendAxios(Base + '/interface/asynRead.php?cmd=get_privilege_personList',{projectId},'GET')


//更新
export const updateApprovalMailApi = (workId,statusId,type,personId,messageText) =>sendAxios(Base + '/interface/asynRead.php?cmd=update_approval_mail',
    {workId,statusId,type,personId,messageText},'POST')