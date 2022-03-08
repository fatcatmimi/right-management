import React from 'react'
import {Form,Input} from 'antd';
import './AddForm.css'

const { TextArea } = Input;
export default class AddMailForm extends React.Component{
    render() {
        let PersonName=''
        if(sessionStorage.getItem('personDetail') != null && sessionStorage.getItem('personDetail') != '') {
            PersonName = JSON.parse(sessionStorage.getItem('personDetail')).PersonName
        }

        return <Form
            ref = {this.props.formInstance}
            labelCol={{span: 4}}
            wrapperCol={{span: 19}}
            initialValues={{
                mail:'@mail.compass.com.cn'
            }}
        >
            <Form.Item label="申请人">
                <Input disabled bordered={false} value={PersonName} />
            </Form.Item>
            <Form.Item label="邮箱前缀名" name = 'mail' rules={[
                    {
                        required: true,
                        message: '请输入邮箱',
                    },
                    {
                        pattern: /^[a-zA-Z0-9_-]+@mail.compass.com.cn$/,
                        message: '邮箱格式必须是*****@mail.compass.com.cn',
                    },
                ]}>
                <Input maxLength={50} />
            </Form.Item>
            <Form.Item label="邮箱示例">
                <span className='example'>示例(姓名：张三):zhangsan@mail.compass.com.cn</span>
            </Form.Item>

            <Form.Item
                label="申请原因"
                name = 'messageText'
                rules={[{required: true, message: '请输入申请原因'}]}
            >
                <TextArea rows={4} showCount maxLength={100}/>
            </Form.Item>
        </Form>
    }
}
