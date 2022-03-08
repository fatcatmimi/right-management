import React from 'react'
import { Form, Select, Button } from 'antd'

import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

export default class ToolBar_Headphone extends React.Component {

    render() {
        const { batchArray, formInstance, clearData, getData, getBatchArray, handleChangeStatus } = this.props
        return <Form
            ref={formInstance}
            layout={'inline'}
            // labelCol={{ span: 14 }}
            // wrapperCol={{ span: 15 }}
            initialValues={{
                status: "1"
            }}
            onFieldsChange={clearData}
        >
            <Form.Item name="status" label="申请状态" rules={[{ required: true, message: '请选择' }]} >
                <Select
                    onChange={(value) => {
                        formInstance.current.setFieldsValue({ 'batch': '' });
                        getBatchArray(value)
                        handleChangeStatus(value)
                    }}
                    style={{ width: 100 }}
                >
                    <Option value="-1">所有</Option>
                    <Option value="1">申请中</Option>
                    <Option value="2">已完成</Option>
                    <Option value="3">已驳回</Option>
                </Select>
            </Form.Item>
            <Form.Item name="batch" label="申请批次" rules={[{ required: true, message: '请选择' }]} >
                <Select
                    style={{ width: 200 }}
                >{
                        (batchArray ?? []).map((item) => {
                            return <Option key={item.BatchId} value={item.BatchId}>{item.BatchName}</Option>
                        })
                    }

                </Select>
            </Form.Item>
            <Form.Item >
                <Button type="primary" icon={<SearchOutlined />} onClick={() => { getData() }}>
                    查询
                </Button>
            </Form.Item>
        </Form>
    }
}
