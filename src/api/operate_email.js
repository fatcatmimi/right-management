import {sendAxios} from "./sendAxios";
import {Base} from '../config/memory_config'

//获取
export const getOperateMailDataApi = (statusId,projectId,startDate,endDate,begin,end) =>sendAxios(Base + '/interface/asynRead.php?cmd=get_operate_mail',{statusId,projectId,startDate,endDate,begin,end},'GET')

//发送邮件后更新状态
export const updateOperateMailDataApi = (optionPersonId,workId) =>sendAxios(Base + '/interface/asynRead.php?cmd=update_operate_mail',{optionPersonId,workId},'GET')
