import { useState, useEffect } from 'react'
import { Space, Card, Table, Button, Select, message } from 'antd'
import { getApprovalEquipment, updateApprovalEquipment } from '../../api/'
const { Option } = Select
const { Column } = Table
const Index = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [applyStatus, setApplyStatus] = useState('-1');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [])
    const getData = async () => {
        setLoading(true)
        const result = await getApprovalEquipment(applyStatus)
        if (result.errMsg === 'OK') {
            setData(result.data)
        } else {
            setData([])
            message.error(result.errMsg)
        }
        setLoading(false)
    }

    const handleRowSelect = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const handleClickRow = (record) => {
        const { workflowId } = record
        setSelectedRowKeys([workflowId])
    }

    const handleSearch = () => {
        getData()
    }
    const handleChange = (value) => {
        setApplyStatus(value)
    }


    const handleAgree = async (stype) => {
        if (selectedRowKeys.length > 0) {
            const row = data.filter((value) => {
                return selectedRowKeys[0] === value.workflowId
            })
            if (!row) {
                throw new Error('没有找到行记录');
            }
            const result = await updateApprovalEquipment(selectedRowKeys[0], row[0].StateId, stype === 1 ? 'update_region' : 'reject')

            if (result === 'OK') {
                message.success('操作成功')
            } else {
                message.error('操作失败')
            }

            getData()

        } else {
            message.error('请选择一条记录')
        }

    }

    return <Card
        title={<Space size={'middle'}>
            <span style={{ fontSize: '12px' }}>申请状态:</span>
            <Select style={{ width: '100px' }} defaultValue={applyStatus} onChange={handleChange}>
                <Option value="-1">所有</Option>
                <Option value="1">申请中</Option>
                <Option value="2">已同意</Option>
                <Option value="3">已驳回</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
        </Space>
        }
        extra={<Space>
            <Button type="primary" onClick={() => handleAgree(1)}>同意</Button>
            <Button type="danger" onClick={() => handleAgree(2)}>驳回</Button>
        </Space>}
    >
        <Table
            dataSource={data}
            bordered={true}
            rowKey='workflowId'
            rowSelection={{
                type: 'radio',
                onChange: handleRowSelect,
                selectedRowKeys
            }}
            loading={loading}
            pagination={false}
            onRow={record => {
                return {
                    onClick: event => { handleClickRow(record) }, // 点击行
                };
            }}
        >
            <Column title="序号" dataIndex='rowId' />
            <Column title="资产名称" dataIndex='AssetsName' />
            <Column title="申请资产类别" dataIndex='AssetsType' />
            <Column title="使用人" dataIndex='UserPersonName' />
            <Column title="部门" dataIndex='DeptName' />
            <Column title="数量" dataIndex='ApplyNum' />
            <Column title="申请时间" dataIndex='ApplyTime' />
            <Column title="申请原因" dataIndex='ApplyRemark' />
            <Column title="状态" dataIndex='ApplyStatus' />
            <Column title="申请结果" dataIndex='OptionType' render={(text) => text === null ? '' : text === 1 ? '同意' : '拒绝'} />
            <Column title="备注" dataIndex='OptionRemark' />
        </Table>
    </Card>
}

export default Index