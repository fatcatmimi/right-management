import React from 'react'
import { Input, Form } from 'antd'

const { TextArea } = Input
export default class SendEmail extends React.Component {

    render() {
        return <Form ref={this.props.formInstance}
            initialValues={{
                messageText: `您好:\n您的企业邮箱已经开通，具体操作信息如下,具体操作信息如下:\n\n账户:\n\n密码:\n\n以上为初始化密码,请自行修改。\n\n修改方法：登录 http://mail.sina.net/,选择 "设置",在选择"修改密码"。`
            }}
        >
            <Form.Item label='邮件内容' name='messageText'
                rules={[{ required: true, message: '请填写邮件内容!' }]}
            >
                <TextArea
                    showCount
                    maxLength={200}
                    rows={11}
                    style={{ resize: 'none' }}
                />
            </Form.Item>
        </Form>
    }
}