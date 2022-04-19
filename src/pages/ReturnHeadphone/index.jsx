import { useState, useEffect } from 'react';
import { Card, Space, Table, Button, Select, Input, Modal, Form, message, InputNumber } from 'antd';
import { getAssertName, getAssertType, getReturnEquipmentData, editReturnEquipment, returnEquipment } from '../../api';
import { PageSize } from "../../config/memory_config";
const { Option } = Select;
const { Column } = Table;

const Index = () => {
    const [data, setData] = useState({
        loading: false,
        data: [],
        total: 0
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [searchForm] = Form.useForm();
    const [form] = Form.useForm();
    let selectedRow = [];

    useEffect(() => {
        getData();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = (type) => {
        //修改回填Form //补录不回填Form
        if (type === 1 || type === 3) {
            //判断是否有选择行
            if (selectedRowKeys.length > 0) {
                selectedRow = data.data.filter(
                    (item) => item.workflowId === selectedRowKeys[0]
                )

            } else {
                message.error('请选择一行记录');
                return;
            }
        }

        Modal.confirm({
            title: type === 1 ? '修改' : type === 2 ? '补录' : '归还地区',
            centered: true,
            content: <ReturnForm form={form} type={type} selectedRow={type === 1 || type === 3 ? selectedRow : []
            } />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => handleSubmit(type)
        })
    }

    const handleSubmit = (type) => {
        console.log('types:', type)
        return new Promise(async (resolve, reject) => {
            try {
                let result = '';
                if (type === 1 || type === 2) {
                    const { userPersonId, assetName, assetType, applyCenter, workflowId } = await form.validateFields();
                    result = await editReturnEquipment(userPersonId, assetName, assetType, applyCenter, workflowId)
                } else {
                    const { optionCenter, workflowId } = await form.validateFields();
                    result = await returnEquipment(workflowId, optionCenter)
                }

                if (result === 'OK') {
                    resolve();
                    getData();
                } else {
                    message.error('操作失败');
                    reject('操作失败')
                }
            } catch (e) {
                console.log(e)
                reject(e.message)
            }
        })
    }

    const handleRowSelect = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const handleClickRow = (record) => {
        const { workflowId } = record
        setSelectedRowKeys([workflowId])
    }

    const getSearchForm = () => {
        return searchForm.getFieldsValue()
    }

    const getData = async (begin = 1, end = 10) => {
        setData({
            data: [],
            loading: true,
            total: 0
        })
        const { applyStatus, userPersonId } = getSearchForm()
        const result = await getReturnEquipmentData(applyStatus, userPersonId.trim(), begin, end)

        if (result.errMsg === 'OK') {
            setData({
                data: result.data,
                loading: false,
                total: result.total
            })
        } else {
            message.error(result.errMsg)
            setData({
                data: [],
                loading: false,
                total: 0
            })
        }
    }

    return <Card
        title={
            <Form layout={'inline'}
                form={searchForm}
                initialValues={{
                    applyStatus: '-1',
                    userPersonId: ''
                }}
            >
                <Form.Item
                    label="申请状态"
                    name="applyStatus"
                >
                    <Select style={{ width: '100px' }}>
                        <Option value="-1">所有</Option>
                        <Option value="1">未完成</Option>
                        <Option value="2">已完成</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="用户卡号"
                    name="userPersonId">
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={() => getData()}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
        }
        extra={<Space>
            <Button type="primary" onClick={() => handleClick(1)}>修改</Button>
            <Button type="primary" onClick={() => handleClick(2)}>补录</Button>
            <Button type="primary" onClick={() => handleClick(3)}>完成</Button>
        </Space>}
    >
        <Table dataSource={data.data}
            bordered={true}
            rowKey='workflowId'
            rowSelection={{
                type: 'radio',
                onChange: handleRowSelect,
                selectedRowKeys
            }}
            loading={data.loading}
            size={'small'}
            pagination={{
                pageSize: PageSize,
                total: data.total,
                showSizeChanger: false,
                onChange: (pageNumber, pageSize) => {
                    var begin = (pageNumber - 1) * pageSize + 1;
                    var end = pageNumber * pageSize;

                    getData(begin, end)
                }
            }}
            onRow={record => {
                return {
                    onClick: event => { handleClickRow(record) }, // 点击行
                };
            }}
        >
            <Column title="序号" dataIndex='rowId' />
            <Column title="资产名称" dataIndex='AssetsName' />
            <Column title="资产类别" dataIndex='AssetsType' />
            <Column title="申请人" dataIndex="ApplyPersonName" />
            <Column title="部门" dataIndex="DeptName" />
            <Column title="使用人" dataIndex="UserPersonName" />
            <Column title="数量" dataIndex="ApplyNum" />
            <Column title="申请地点" dataIndex="ApplyCenter" />
            <Column title="申请日期" dataIndex="ApplyTime" />
            <Column title="操作状态" dataIndex="ApplyStatus" />
            <Column title="操作人" dataIndex="OptionPersonName" />
            <Column title="归还地点" dataIndex="OptionCenter" />
            <Column title="归还日期" dataIndex="OptionTime" />
            <Column title="备注" dataIndex="OptionRemark" />

        </Table>
    </Card>
}

function ReturnForm(props) {
    const [assetName, setAssetName] = useState([]);
    const [assetType, setAssetType] = useState([])
    //获取资产名称和资产分类
    async function getAssertAndAssertType() {
        setAssetName(await getAssertName(2))
        //获取选择的资产名称
        if (props.type === 1) {
            const { AssetsId } = props.selectedRow[0];
            setAssetType(await getAssertType(AssetsId))
        }

    }

    const handleChange = async (value) => {
        props.form.resetFields(['assetType'])
        setAssetType(await getAssertType(value))
    }

    useEffect(() => {
        if (props.type !== 3) {
            getAssertAndAssertType();
        }

        if (props.selectedRow.length > 0) {
            const [selectRow] = props.selectedRow;
            props.form.setFieldsValue({
                workflowId: selectRow.workflowId,
                userPersonId: selectRow.UserPersonId,
                userPersonName: selectRow.UserPersonName,
                assetName: selectRow.AssetsId,
                assetType: selectRow.AssetsTypeId,
                applyCenter: '' + selectRow.ApplyCenterId
            })
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Form
        form={props.form}
        preserve={false}
    >
        <Form.Item
            name="workflowId"
            label="workflowId"
            hidden="true"
        >
            <InputNumber disabled={true} />
        </Form.Item>
        {
            props.type === 3 ?
                <Form.Item
                    name="optionCenter"
                    label="地区"
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
                        name="userPersonId"
                        label="用户卡号"
                        hidden={props.type === 1 ? true : false}
                        labelCol={{ offset: 1 }}
                    >
                        <InputNumber disabled={props.type === 2 ? false : true}
                            style={{ width: 230 }}
                            min={2000000}
                            max={2999999}
                        />
                    </Form.Item>
                    {
                        props.type === 1 ?
                            <Form.Item
                                name="userPersonName"
                                label="使用人"
                                labelCol={{ offset: 1, span: 5 }}
                            >
                                <Input disabled={true} />
                            </Form.Item>
                            : null
                    }

                    <Form.Item
                        name="assetName"
                        label="资产名称"
                        rules={[
                            {
                                required: true,
                                message: '请选择'
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
                                message: '请选择'
                            },
                        ]}
                    >
                        <Select>
                            {assetType.map(item => <Option value={item.AssetsTypeId} key={item.AssetsTypeId}>{item.AssetsType}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="applyCenter"
                        label="申请地点"
                        rules={[
                            {
                                required: true,
                                message: '请选择'
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