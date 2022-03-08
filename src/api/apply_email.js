import {sendAxios} from "./sendAxios";
import {Base} from '../config/memory_config'

//获取
export const getMailDataApi = (statusId,projectId,startDate,endDate,begin,end) =>sendAxios(Base + '/interface/asynRead.php?cmd=get_mail',{statusId,projectId,startDate,endDate,begin,end},'GET')

//申请
export const addMailApi = (mail,messageText,projectId) => sendAxios(Base+'/interface/asynRead.php?cmd=add_mail',{mail,messageText,projectId},'POST')

//删除
export const deleteMailApi = (workId) => sendAxios(Base+'/interface/asynRead.php?cmd=delete_mail',{workId},'POST')

//查看流程
export const getMailDetailDataApi = (workId) =>sendAxios(Base + '/interface/asynRead.php?cmd=get_detail_mail',{workId},'GET')