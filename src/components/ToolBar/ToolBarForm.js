import React from 'react'
import { Form, Select, Button, DatePicker } from 'antd';
import { withRouter } from 'react-router-dom'
import { SyncOutlined } from '@ant-design/icons'
import moment from 'moment'
import './ToolBarForm.css'


const { Option } = Select;
const { RangePicker } = DatePicker;

class ToolBarForm extends React.Component {
    render() {
        const { title, data } = this.props.selectData
        return <Form id='aaa'
            ref={this.props.formInstance}
            onFinish={this.onFinish}
            layout="inline"
            initialValues={{
                searchStatus: '-1',
                searchDate: [moment('2021-10-01'), moment()]
            }}
        >
            <Form.Item
                label={title}
                name="searchStatus"
                // labelCol={{ span: 15 }}
                // wrapperCol={{ span: 15}}
                rules={[{ required: true, message: '请选择状态' }]}
            >
                <Select style={{ width: 120 }}>
                    {
                        data.map((item) => <Option key={item.value} value={item.value}>{item.title}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                label="起止日期"
                name="searchDate"
                // labelCol={{ span: 10 }}
                // wrapperCol={{ span: 20 }}
                rules={[{ required: true, message: '请选择日期' }]}
            >
                <RangePicker />
            </Form.Item>
            <Form.Item>
                <Button type='primary' icon={<SyncOutlined />}
                    //htmlType="submit"
                    onClick={this.props.getData}
                >查询</Button>
            </Form.Item>
        </Form>
    }
}

export default withRouter(ToolBarForm)