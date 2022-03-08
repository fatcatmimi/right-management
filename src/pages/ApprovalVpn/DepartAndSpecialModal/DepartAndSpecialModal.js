import React from 'react'
import {Modal,Form,Radio,Input,message} from 'antd'
import {updateApprovalMailApi} from '../../../api'


const { TextArea } = Input;
export default class DepartAndSpecialModal extends React.Component{
    formRef = React.createRef();

    state = {
        confirmLoading:false,
        isRequired:false
    }

    handleOK = async () =>{
        const {visible:type,getParam,closeWindow,getData}=this.props
        const {pass:statusId,messageText:approvalRemark} = await this.formRef.current.validateFields()
        const {workId,personId}= getParam()

        const result = await updateApprovalMailApi(workId,statusId,type,personId,approvalRemark);

        if(result.errMsg === 'OK'){
            message.success('成功')
            closeWindow()
            getData()
        }else{
            message.error(result.errMsg)
        }
    }

    handleRadio = (e) =>{
        const value = e.target.value
        if(value === 3){
            this.setState({isRequired:false})
        }else{
            this.setState({isRequired:true})
        }
    }

    render(){
        const {visible,closeWindow}  = this.props
        const {isRequired} = this.state
        const radioValue= visible == 1 ? {
            pass:3,
            noPass:2
        } : {
            pass:7,
            noPass:6
        }

        return <Modal visible={visible===1 || visible ===3}          //1部门审批   3特别审批
                      title='审批操作'
                      centered
                      destroyOnClose
                      okText='确定'
                      cancelText='取消'
                      confirmLoading={this.state.confirmLoading}
                      onOk = {this.handleOK}
                      onCancel = {closeWindow}
        >
                    <Form
                        ref={this.formRef}
                        labelAlign='left'
                        preserve={false}
                        labelCol ={{span:5, offset:1}}
                    >
                        <Form.Item
                            label="批复意见"
                            name="pass"
                            rules={[{ required: true, message: '请选择!!!' }]}
                        >
                            <Radio.Group onChange={(e)=>{this.handleRadio(e)}}>
                                <Radio value={radioValue.pass}>同意</Radio>
                                <Radio value={radioValue.noPass}>不同意</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="备注"
                            name="messageText"
                            rules={
                                    [{ required: isRequired, message: '请选择!!!' }]
                            }
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                    </Form>
               </Modal>

    }
}