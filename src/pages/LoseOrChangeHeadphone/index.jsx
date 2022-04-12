import { useState, useEffect } from 'react'
import { Card, Table, Space, Button, Select, Modal, Form, Input, message } from 'antd'
import { CloseOutlined } from '@ant-design/icons';

import { getAssertName, getAssertType, getOldMissInfo, submitMissInfo, getMissInfo, deleteMissInfo } from '../../api/index'

const { Option } = Select;
const { TextArea } = Input;
const LoseOrChangeHeadphone = (props) => {
    const stype = props.match.path === '/apply/equipment/lose' ? 'lose' : 'change';
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [applyStatus, setApplyStatus] = useState('-1');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])


    const columns = [{
        title: '序号',
        dataIndex: 'rowId'
    },
    {
        title: '资产名称',
        dataIndex: 'AssetsName',
    },
    {
        title: '资产类别',
        dataIndex: 'AssetsType',
    }, {
        title: '部门',
        dataIndex: 'DeptName',
    }, {
        title: '使用人',
        dataIndex: 'UserPersonName',
    }, {
        title: '数量',
        dataIndex: 'ApplyNum',
    }, {
        title: '申请日期',
        dataIndex: 'ApplyTime',
    }, {
        title: '申请原因',
        dataIndex: 'ApplyRemark',
    }, {
        title: '状态',
        dataIndex: 'ApplyStatu',
    }, {
        title: '审批人',
        dataIndex: 'RoleName',
    }, {
        title: '审批意见',
        dataIndex: 'OptionType',
    }, {
        title: '备注',
        dataIndex: 'OptionRemark',
    }];

    useEffect(() => {
        getData()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = async () => {
        setLoading(true)
        const cmd = stype === 'lose' ? 'get_lose_data' : 'get_change_data';
        const result = await getMissInfo(applyStatus, cmd);
        if (result.errMsg === 'OK') {
            setData(result.data)
        } else {
            setData([])
            message.error(result.errMsg)
        }
        setLoading(false)
    }

    const handleSearch = () => {
        getData()
    }

    const handleClick = () => {
        Modal.confirm({
            title: stype === 'lose' ? '丢失领用' : "置换申请",
            destroyOnClose: true,
            centered: true,
            content: <LoseForm form={form} />,
            okText: '确认',
            cancelText: '取消',
            onOk: handleSubmit
        })
    }

    const handleSubmit = () => {
        return new Promise(async function (resolve, reject) {
            try {
                const cmd = stype === 'lose' ? 'lose_insert' : 'change_insert'
                const { assertId, assetsTypeId, relationId, newAssetsTypeId, applyRemark } = await form.validateFields()
                const errMsg = await submitMissInfo(assertId, assetsTypeId, newAssetsTypeId, applyRemark, relationId, cmd)
                if (errMsg === 'OK') {
                    message.success('申请成功')
                    getData();
                    resolve();
                } else {
                    message.error(errMsg);
                    reject();
                }
            } catch (e) {
                reject()
            }
        })
    }

    const handleSelectSearch = (value) => {
        setApplyStatus(value)
    }


    const handleRowSelect = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const handleClickRow = (record) => {
        const { workflowId } = record
        setSelectedRowKeys([workflowId])
    }

    const handleDelete = async () => {
        if (selectedRowKeys.length > 0) {
            const result = await deleteMissInfo(selectedRowKeys[0], data[0].stateId)
            if (result === 'OK') {
                getData()
            } else {
                message.error(result)
            }
        } else {
            message.error('请选择要删除的行')
        }

    }

    return <Card title={<Space>
        <span style={{ fontSize: '12px' }}>申请状态:</span>

        <Select defaultValue={applyStatus} style={{ width: 120 }} onChange={handleSelectSearch}>
            <Option value="-1">所有</Option>
            <Option value="1">申请中</Option>
            <Option value="2">已完成</Option>
            <Option value="3">已驳回</Option>
        </Select>

        <Button type="primary" onClick={handleSearch}>刷新</Button></Space>}
        extra={
            <Space>
                <Button danger icon={<CloseOutlined />} onClick={handleDelete}>作废</Button>
                <Button type="primary" onClick={handleClick}>{stype === 'lose' ? '丢失领用' : "置换申请"}</Button>
            </Space>
        }>



        <Table columns={columns}
            bordered={true}
            dataSource={data}
            loading={loading}
            rowKey={'workflowId'}
            pagination={false}
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
        />
    </Card>
}


const LoseForm = (props) => {
    const [assetName, setAssetName] = useState([]);
    const [assetType, setAssetType] = useState([]);
    let personName = JSON.parse(sessionStorage.getItem('personDetail'))?.PersonName;

    useEffect(() => {
        getAsset()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getAsset() {
        setAssetName(await getAssertName(2));
    }

    function getAssetType() {
        //获取资产类别
        return props.form.getFieldValue('assertId')
    }

    async function hanldeAssetsSelect(assetsId) {
        //获取原申请信息
        const { errMsg, data } = await getOldMissInfo(assetsId)
        const assetTypeList = await getAssertType(getAssetType());

        setAssetType(assetTypeList)
        if (errMsg === 'OK') {

            props.form.setFieldsValue({
                assetsTypeId: data[0].AssetsTypeId,
                newAssetsTypeId: data[0].newAssetsTypeId,
                relationId: data[0].RelationId
            });
        } else {
            props.form.setFieldsValue({
                assetsTypeId: null,
                newAssetsTypeId: null,
                relationId: -1
            });
        }
    }

    return <Form
        preserve={false}
        initialValues={{
            useName: personName,
        }}
        form={props.form}
        labelCol={{
            span: 8,
        }}
        wrapperCol={{
            span: 16,
        }}
    >
        <Form.Item
            name="useName"
            label="姓名卡号"
            rules={[
                {
                    required: true,
                    message: '请选择'
                },
            ]}
        >
            <Input disabled={true} />
        </Form.Item>
        <Form.Item
            name="assertId"
            label="资产名称"
            rules={[
                {
                    required: true,
                    message: '请选择'
                },
            ]}
        >
            <Select onSelect={hanldeAssetsSelect}>
                {assetName.map((item) => {
                    return <Option value={item.AssetsId} key={item.AssetsId}>{item.AssetsName}</Option>
                })}
            </Select>
        </Form.Item>
        <span style={{ color: '#C0C0C0' }}>原申请信息</span>
        <hr></hr>
        <Form.Item
            name="assetsTypeId"
            label="丢失资产类别"
            rules={[
                {
                    required: true,
                    message: '请选择'
                },
            ]}
        >
            <Select>
                {
                    assetType.map(
                        item =>
                            <Option value={item.AssetsTypeId} key={item.AssetsTypeId}>{item.AssetsType}</Option>)
                }
            </Select>
        </Form.Item>
        {/* <Form.Item
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
        </Form.Item> */}
        {<Form.Item
            name="relationId"
            label="关联Id"
            hidden={false}
        >
            <Input></Input>
        </Form.Item>}
        <span style={{ color: '#C0C0C0' }}>新申请信息</span>
        <hr style={{ backgroundColor: '#C0C0C0' }}></hr>
        <Form.Item
            name="newAssetsTypeId"
            label="申请资产类别"
            rules={[
                {
                    required: true,
                    message: '请选择'
                },
            ]}
        >
            <Select>
                {
                    assetType.map(
                        item =>
                            <Option value={item.AssetsTypeId} key={item.AssetsTypeId}>{item.AssetsType}</Option>)
                }
            </Select>
        </Form.Item>
        <Form.Item
            name="applyRemark"
            label="申请备注"
            rules={[
                {
                    required: true,
                    message: '请选择'
                },
            ]}
        >
            <TextArea showCount maxLength={100} />
        </Form.Item>
    </Form>
}



export default LoseOrChangeHeadphone
