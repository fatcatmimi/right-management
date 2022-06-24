import React from 'react'
import { Form, Select, Button } from 'antd'

import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

export default class ToolBarHeadphone extends React.Component {
    state = {
        isEnable: false
    }
    render() {
        const { batchArray, formInstance, clearData, getData, getBatchArray, handleChangeStatus, handleChangeStateId, type } = this.props
        const { isEnable } = this.state
        return <Form
            ref={formInstance}
            layout={'inline'}
            // labelCol={{ span: 14 }}
            // wrapperCol={{ span: 15 }}
            initialValues={{
                status: "1", //,type === 1 ? "1" : "1",
                stateId: "1"
            }}
            onFieldsChange={clearData}
        >
            {
                type === 4 ? <Form.Item name="stateId" label="动作" rules={[{ required: true, message: '请选择' }]} >
                    <Select
                        style={{ width: 100 }}
                        onChange={
                            (value) => {
                                if (parseInt(value) === 5 || parseInt(value) === 7) {
                                    this.setState({
                                        isEnable: true
                                    })
                                } else {
                                    this.setState({
                                        isEnable: false
                                    })
                                }
                                handleChangeStateId(value)
                            }
                        }
                    >
                        <Option value="-1" key="-1">所有</Option>
                        <Option value="1" key="1">申请领用</Option>
                        <Option value="5" key="5">丢失领用</Option>
                        <Option value="7" key="7">置换领用</Option>
                    </Select>
                </Form.Item> : null
            }
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
            <Form.Item name="batch"
                label="申请批次"
                rules={isEnable ? null : [{ required: true, message: '请选择' }]}

            >
                <Select
                    style={{ width: 200 }}
                    disabled={isEnable}
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
