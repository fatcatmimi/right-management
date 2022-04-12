import { Space, Card, Table, Button, Select } from 'antd'
const { Option } = Select
const { Column } = Table
const Index = () => {
    return <Card
        title={<Space size={'middle'}>
            <span style={{ fontSize: '12px' }}>申请状态:</span>
            <Select style={{ width: '100px' }}>
                <Option value="-1">所有</Option>
                <Option value="1">申请中</Option>
                <Option value="2">已同意</Option>
                <Option value="3">已驳回</Option>
            </Select>
        </Space>
        }
        extra={<Space>
            <Button type="primary">同意</Button>
            <Button type="danger">驳回</Button>
        </Space>}
    >
        <Table>
            <Column title="序号" dataIndex='id' />
            <Column title="资产名称" dataIndex='id' />
            <Column title="申请资产类别" dataIndex='id' />
            <Column title="使用人" dataIndex='id' />
            <Column title="部门" dataIndex='id' />
            <Column title="数量" dataIndex='id' />
            <Column title="申请时间" dataIndex='id' />
            <Column title="申请原因" dataIndex='id' />
            <Column title="状态" dataIndex='id' />
            <Column title="申请结果" dataIndex='id' />
            <Column title="备注" dataIndex='id' />
        </Table>
    </Card>
}

export default Index