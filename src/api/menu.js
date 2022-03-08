import { sendAxios, sendAxios_formData } from "./sendAxios";
import { Base } from '../config/memory_config'

//获取menu
export const getMenuApi = () => sendAxios(Base + '/interface/asynRead.php?cmd=get_menu', {}, 'GET')

//获取登录person信息
export const getPersonApi = (personId) => sendAxios(Base + '/interface/asynRead.php?cmd=get_person', { personId }, 'GET')

//发送有邮件
export const sendEmail = (subject, content, mailfrom, mailTo, id_list) => sendAxios(Base + '/interface/asynRead.php?cmd=send_mail', { subject, content, mailfrom, mailTo, id_list }, 'POST')

//上传文件
export const uploadFile = (formData) => sendAxios_formData(Base + '/interface/asynRead.php?cmd=get_person', { formData })