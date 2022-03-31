import React from 'react'
import { Form, DatePicker, InputNumber, Button, Select, Input } from 'antd'
import moment from 'moment';


const { RangePicker } = DatePicker;
const { Option } = Select
export default class ToolBarOperateComponent extends React.Component {
    render() {
        const { getData, formInstance, type = 'assetUse' } = this.props
        return (
            <Form layout='inline'
                ref={formInstance}
                initialValues={{
                    begin_end_time: [moment().add(-1, 'y'), moment()],
                    optionCenter: '-1'
                }}
                onFinish={this.getParam}
            >
                <Form.Item
                    label="起止时间"
                    name="begin_end_time"
                >
                    <RangePicker />
                </Form.Item>
                {
                    type === 'assetBack' ? <Form.Item
                        label="归还人"
                        name="returnPersonId"
                    >
                        <InputNumber />
                    </Form.Item> : <Form.Item
                        label="领用人"
                        name="receivePersonId"
                    >
                        <InputNumber />
                    </Form.Item>
                }

                <Form.Item
                    label="使用人"
                    name="userPersonId"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="操作人"
                    name="optionPersonId"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="资产编号"
                    name="assetNumbers"
                >
                    <Input style={{ width: 80 }} />
                </Form.Item>

                {
                    type === 'assetBack' ?
                        <Form.Item
                            label="VPN账号回收"
                            name="VPNAccountRecovery"
                        >
                            <Select style={{ width: 100 }}>
                                <Option value='-1'>所有</Option>
                                <Option value='1'>已回收</Option>
                                <Option value='0'>未回收</Option>
                            </Select>
                        </Form.Item>
                        : <Form.Item
                            label="VPN账号"
                            name="VPNAccount"
                        >
                            <InputNumber />
                        </Form.Item>
                }

                {
                    type === 'assetBack' ? null :
                        <Form.Item
                            label="地点"
                            name="optionCenter"
                        >
                            <Select style={{ width: 100 }}>
                                <Option value="-1">所有</Option>
                                <Option value="1">云集</Option>
                                <Option value="4">佛山</Option>
                            </Select>
                        </Form.Item>
                }

                <Form.Item>
                    <Button type="primary" shape='round' onClick={getData} htmlType="submit">刷新</Button>
                </Form.Item>
            </Form>
        )
    }
} 