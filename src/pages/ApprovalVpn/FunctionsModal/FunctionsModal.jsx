import React from 'react'
import {Modal, Form, Radio, Select, Input, message} from 'antd'
import {getApprovalOperatePersonList,getApprovalPrivilegePersonList ,updateApprovalMailApi} from '../../../api'
// import {MAIL_PROJECTID} from '../../../config/memory_config'

const { TextArea } = Input;
const { Option } = Select;
export default class FunctionsModal extends React.Component{
    formRef = React.createRef();
    state = {
        radioValue : "0" ,
        confirmLoading:false,
        //操作人
        approvalPersonList:[],
        //特权人
        approvalPrivilegePersonList:[],

        isRequired:true
    }

    handleRadio = async (e) =>{
        const radioValue = e.target.value
        let result={}
        if(radioValue === '8'){
            //获取操作人
            this.setState({isRequired:false})
            result = await getApprovalOperatePersonList(this.props.projectId)
            if(result.errMsg === 'OK'){
                 this.setState({
                     approvalPersonList:result.data
                 })
            }
        }else if (radioValue === '-1'){
            this.setState({isRequired:true})
        }else if(radioValue === '5'){
            //获取特权人
            result = await getApprovalPrivilegePersonList(this.props.projectId)
            if(result.errMsg === 'OK'){
                this.setState({
                    approvalPrivilegePersonList:result.data
                })
            }
        }

        this.setState({
            radioValue
        })
    }

    handleOK = async () =>{
        const {visible:type,getParam,closeWindow,getData}=this.props
        const  value= await this.formRef.current.validateFields()
        const {workId}= getParam()

        if(value.pass === '8'){
            //同意
            const result = await updateApprovalMailApi(workId,value.pass,type,value.operate_person,value.messageText)
            if(result.errMsg === 'OK'){
                message.success('成功')
                closeWindow()
                getData()
            }else{
                message.info(result.errMsg)
            }
        }else{
            //不同意
            let result = {}
            if(value.special === '5'){
                result = await updateApprovalMailApi(workId,value.special,type,value.special_person,value.messageText)
            }else{
                result = await updateApprovalMailApi(workId,value.special,type,-1,value.messageText)
            }

            if(result.errMsg === 'OK'){
                message.success('成功')
                closeWindow()
                getData()
            }else{
                message.error(result.errMsg)
            }
        }
    }

    render(){
        const {visible,closeWindow}  = this.props
        const {radioValue,approvalPersonList,approvalPrivilegePersonList,isRequired} = this.state
        return <Modal visible={visible===2}
                      title='审批操作'
                      centered
                      destroyOnClose
                      okText='确定'
                      cancelText='取消'
                      confirmLoading={this.state.confirmLoading}
                      onOk = {this.handleOK}
                      onCancel = {closeWindow}
                      afterClose = {()=>{this.setState({radioValue:'0'})}}
        >
            <Form ref={this.formRef}
                labelAlign='left'
                preserve={false}
                labelCol ={{span:5, offset:1}}
            >
                <Form.Item
                    label="批复意见"
                    name="pass"
                    rules={[{ required: true, message: '请选择批复意见!' }]}
                >
                    <Radio.Group onChange={this.handleRadio}>
                        <Radio value="8">同意</Radio>
                        <Radio value="-1">不同意</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    radioValue === "0" ? null : radioValue === "8" ? (
                        <>
                            <Form.Item
                                label="选择操作人"
                                name="operate_person"
                                rules={[{ required: true, message: '请选择操作人' }]}
                            >
                                <Select>
                                    {
                                        approvalPersonList.map((item)=> <Option key={item.LeaderPersonId} value={item.LeaderPersonId}>{item.PersonName}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </>
                    ):(
                        <>
                            <Form.Item
                                label="特权审批"
                                name="special"
                                rules={[{ required: true , message: '请选择特权审批!' }]}
                            >
                                <Radio.Group onChange={this.handleRadio} >
                                    <Radio value="5">申请</Radio>
                                    <Radio value="4">不申请</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {
                                radioValue === "5" ? (
                                    <Form.Item
                                        label="选择特权人"
                                        name="special_person"
                                        rules={[{ required: true, message: '请选择特权人!' }]}
                                    >
                                        <Select>
                                            {
                                                approvalPrivilegePersonList.map((item)=><Option key={item.LeaderPersonId} value={item.LeaderPersonId}>{item.PersonName}</Option>)
                                            }
                                        </Select>
                                    </Form.Item>
                                ) :null
                            }
                        </>
                    )
                }

                <Form.Item
                    label="备注"
                    name="messageText"
                    rules={
                        [{ required: isRequired, message: '请输入备注!!!' }]
                    }
                >
                    <TextArea rows={4}/>
                </Form.Item>
            </Form>
        </Modal>
    }
}