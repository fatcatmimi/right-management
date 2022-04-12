import { useState, useEffect } from 'react'
import { Card, Space, Table, Button, Select, Input, Modal, Form, message } from 'antd'
import { getAssertName, getAssertType } from '../../api'
const { Option } = Select
const { Column } = Table;
const Index = () => {
    const [data, setData] = useState([
        { id: 1, assetName: 11, assetType: 111 }, { id: 2, assetName: 22, assetType: 222 }
    ]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [form] = Form.useForm();
    let selectedRow = [];

    const handleClick = (type) => {
        //修改回填Form //补录不回填Form
        if (type === 1) {
            //判断是否有选择行
            if (selectedRowKeys.length > 0) {
                selectedRow = data.filter(
                    (item) => item.id === selectedRowKeys[0]
                )

            } else {
                message.error('请选择一行记录');
                return;
            }
        }
        Modal.confirm({
            title: type === 1 ? '修改' : '补录',
            centered: true,
            content: <ReturnForm form={form} type={type} selectedRow={type === 1 ? selectedRow : []
            } />,
            okText: '确认',
            cancelText: '取消',
            // onOk: handleSubmit
        })
    }

    const handleRowSelect = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const handleClickRow = (record) => {
        const { id } = record
        setSelectedRowKeys([id])
    }

    return <Card
        title={<Space size={'middle'}>
            <span style={{ fontSize: '12px' }}>申请状态:</span>
            <Select style={{ width: '100px' }}>
                <Option value="-1">所有</Option>
                <Option value="1">申请中</Option>
                <Option value="2">已完成</Option>
                <Option value="3">已驳回</Option>
            </Select>

            <span style={{ fontSize: '12px' }}>使用人:</span>
            <Input></Input>

            <Button type='primary'>查询</Button>
        </Space>
        }
        extra={<Space>
            <Button type="primary" onClick={() => handleClick(1)}>修改</Button>
            <Button type="primary" onClick={() => handleClick(2)}>补录</Button>
            <Button type="primary" onClick={() => handleClick(3)}>完成</Button>
        </Space>}
    >
        <Table dataSource={data}
            bordered={true}
            rowKey='id'
            rowSelection={{
                type: 'radio',
                onChange: handleRowSelect,
                selectedRowKeys
            }}
            onRow={record => {
                return {
                    onClick: event => { handleClickRow(record) }, // 点击行
                };
            }}
        >
            <Column title="序号" dataIndex='id' />
            <Column title="资产名称" dataIndex='assetName' />
            <Column title="资产类别" dataIndex='assetType' />
            {/* <Column title="申请人" key="action" />
            <Column title="部门" key="action" />
            <Column title="使用人" key="action" />
            <Column title="数量" key="action" />
            <Column title="申请日期" key="action" />
            <Column title="操作状态" key="action" />
            <Column title="操作人" key="action" />
            <Column title="地点" key="action" />
            <Column title="归还日期" key="action" />
            <Column title="备注" key="action" /> */}

        </Table>
    </Card>
}

function ReturnForm(props) {
    const [assetName, setAssetName] = useState([]);
    const [assetType, setAssetType] = useState([])
    //获取资产名称和资产分类
    async function getAssertAndAssertType() {
        setAssetName(await getAssertName(2))
    }

    const handleChange = async (value) => {
        props.form.resetFields(['assetType'])
        setAssetType(await getAssertType(value))
    }

    useEffect(() => {
        if (props.type !== 3) {
            getAssertAndAssertType()
            if (props.selectedRow.length > 0) {
                const [selectRow] = props.selectedRow;
                props.form.setFieldsValue(selectRow)
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Form
        form={props.form}
        preserve={false}
    >
        {
            props.type === 3 ?
                <Form.Item
                    name="useName"
                    label="输入卡号"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select placeholder='请选择地区' style={{ width: 200 }}>
                        <Option value="1">云集</Option>
                        <Option value="4">智富</Option>
                    </Select>
                </Form.Item> :
                <>
                    <Form.Item
                        name="useName"
                        label="输入卡号"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled={props.type === 1 ? true : false} />
                    </Form.Item>
                    <Form.Item
                        name="assetName"
                        label="资产名称"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select onChange={handleChange}>
                            {assetName.map(item => <Option value={item.AssetsId} key={item.AssetsId}>{item.AssetsName}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="assetType"
                        label="资产类别"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select>
                            {assetType.map(item => <Option value={item.AssetsTypeId} key={item.AssetsTypeId}>{item.AssetsType}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label="申请地点"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select>
                            <Option value="1">云集</Option>
                            <Option value="4">智富</Option>
                        </Select>
                    </Form.Item>

                </>

        }

    </Form>
}

export default Index