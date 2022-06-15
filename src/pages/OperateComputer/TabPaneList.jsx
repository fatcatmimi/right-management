import React from 'react';
import { Table, Button, Card, Space, Modal, message, Form, Input, Select, Radio, InputNumber } from 'antd'
import ToolBarOperateComponent from '../../components/ToolBar_OperateComputer'
import { CloseOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import {
    getUseDataApi, getAssertName, getAssertType, getCompanyRegion,
    insertComputerUse, deleteComputerData, insertComputerBack,
    getComputerAssetNumbers, getBackDataApi, updateComputerVPNApi
} from '../../api'
import PubSub from 'pubsub-js'


const { Option } = Select
const { TextArea } = Input;
const { Column } = Table;


//作废
function cancelItem(componentType, id, getData) {
    Modal.confirm({
        title: '是否确认删除?',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        centered: true,
        onOk: async () => {
            const result = await deleteComputerData(componentType, id);
            if (result === 'OK') {
                getData();
                message.success('作废成功');
                return;
            }
            message.error(result);
        }
    })
}

export class AssetUse extends React.Component {

    toolbar = React.createRef()
    useForm = React.createRef()

    state = {
        data: [],
        selectRowKeys: [],
        loading: false
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    getParam = () => {
        const {
            begin_end_time: [startDate, endDate],
            receivePersonId = -1,
            userPersonId = -1,
            optionPersonId = -1,
            assetNumbers = -1,
            VPNAccount = -1,
            optionCenter
        } = this.toolbar.current.getFieldsValue();

        console.log(this.toolbar.current.getFieldsValue())

        return {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            receivePersonId,
            userPersonId,
            optionPersonId,
            assetNumbers,
            VPNAccount,
            optionCenter
        }

    }

    getData = async () => {
        this.setState({ loading: true })
        const {
            startDate,
            endDate,
            receivePersonId,
            userPersonId,
            optionPersonId,
            assetNumbers,
            VPNAccount,
            optionCenter
        } = this.getParam()

        console.log('VPNAccount:' + VPNAccount)

        const result = await getUseDataApi(
            startDate,
            endDate,
            receivePersonId,
            userPersonId,
            optionPersonId,
            assetNumbers,
            VPNAccount,
            optionCenter
        )
        if (result.errMsg === 'OK') {
            this.setState({
                selectRowKeys: [],
                data: result.data,
                loading: false
            })
        } else {
            this.setState({
                selectRowKeys: [],
                data: [],
                loading: false
            })
        }
    }

    //选择某行时，传递key
    onSelectChange = selectedRowKeys => {
        this.setState({
            selectRowKeys: selectedRowKeys
        })
    }

    handleCancelButton = () => {
        const { selectRowKeys: [id] } = this.state;
        cancelItem('assetUse', id, this.getData)
    }

    handleBackButton = (e, record) => {
        e.stopPropagation();
        this.props.changeTab('assetBack')

        Modal.confirm({
            width: 450,
            title: '确认归还',
            content: <UseForm formInstance={this.useForm}
                projectId={this.props.projectId}
                type='assetBack'
                initData={record} />,
            centered: true,
            okText: '确认',
            cancelText: '取消',
            okButtonProps: {
                loading: false
            },
            onOk: (e) => {
                return new Promise(async (resolve, reject) => {
                    const { Remark, ReturnPersonName: returnPersonId, VPNAccountRecovery } = await this.useForm.current.validateFields();

                    const result = await insertComputerBack(record.Id, returnPersonId, VPNAccountRecovery, Remark)

                    if (result === 'OK') {
                        PubSub.publish('flushData');
                        message.success('归还成功');
                        resolve();
                    } else {
                        message.error(result)
                        reject()
                    }

                })
            }
        })

    }

    handleUseButton = () => {
        Modal.confirm({
            width: 450,
            title: '领用',
            centered: true,
            content: <UseForm formInstance={this.useForm}
                projectId={this.props.projectId}
                type='assetUse'
            />,
            okText: '确定',
            cancelText: '取消',
            okButtonProps: {
                loading: false
            },
            onOk: (e) => {
                return new Promise(async (resolve, reject) => {
                    const value = await this.useForm.current.validateFields();
                    const result = await insertComputerUse(
                        this.props.projectId
                        , value.AssetNumbers
                        , value.AssetsName
                        , value.AssetsType
                        , value.ReceivePersonName
                        , value.UserPersonName
                        , value.OptionCenter
                        , value.VPNAccount
                        , value.Remark
                    )
                    if (result === 'OK') {
                        message.success('领用成功');
                        this.getData();
                        resolve();
                    } else {
                        message.error(result);
                        reject(result);
                    }

                })

            }
        })
    }

    render() {
        const { data, selectRowKeys, loading } = this.state
        return <Card title={<ToolBarOperateComponent formInstance={this.toolbar} getData={this.getData} />}
            extra={<Space>
                <Button type='primary' icon={<CloseOutlined />} onClick={this.handleCancelButton} disabled={!selectRowKeys.length > 0}>作废</Button>
                <Button type='primary' icon={<IssuesCloseOutlined />} onClick={this.handleUseButton}> 领用</Button>
            </ Space>}
            bordered={false}
        >
            <Table bordered
                dataSource={data}
                rowKey='Id'
                loading={loading}
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectRowKeys,
                    onChange: this.onSelectChange
                }}
                size='small'
                onRow={record => {
                    return {
                        onClick: () => {
                            this.onSelectChange([record.Id])
                        }
                    }
                }}
                pagination={{
                    showSizeChanger: false
                }}
            >
                <Column title="序号" align='center' dataIndex='RowId' />
                <Column title="资产编号" align='center' dataIndex='AssetNumbers' />
                <Column title="资产名称" align='center' dataIndex='AssetsName' />
                <Column title="领用人" align='center' dataIndex='ReceivePersonName' />
                <Column title="部门" align='center' dataIndex='DepartName' />
                <Column title="使用人" align='center' dataIndex='UserPersonName' />
                <Column title="领用时间" align='center' dataIndex='ReceiveTime' />
                <Column title="数量" align='center' dataIndex='ReceiveNum' />
                <Column title="领用操作人" align='center' dataIndex='OptionPersonName' />
                <Column title="地点" align='center' dataIndex='OptionCenter' />
                <Column title="VPN账号" align='center' dataIndex='VPNAccount' />
                <Column title="备注" dataIndex='Remark' />
                <Column title="操作" align='center' render={(text, record) => {
                    return <Button type='primary' shape="round"
                        disabled={!(record.ReturnBtn === 1)}
                        onClick={(e) => { this.handleBackButton(e, record) }}>归还</Button>
                }} />
            </Table>
        </Card >
    }
}





export class AssetBack extends React.Component {
    toolbar = React.createRef();
    useForm = React.createRef();

    state = {
        data: [],
        selectRowKeys: [],
        loading: false
    }

    componentDidMount() {
        this.pubsub_token = PubSub.subscribe('flushData', () => {
            this.getData()
        })
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
        this.setState = (state, callback) => {
            return;
        }
    }
    getParam = () => {
        const {
            begin_end_time: [startDate, endDate],
            returnPersonId = -1,
            userPersonId = -1,
            optionPersonId = -1,
            assetNumbers = -1,
            VPNAccountRecovery = -1,

        } = this.toolbar.current.getFieldsValue();

        return {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            returnPersonId,
            userPersonId,
            optionPersonId,
            assetNumbers,
            VPNAccountRecovery,
        }

    }

    getData = async () => {
        this.setState({ loading: true })
        const {
            startDate,
            endDate,
            returnPersonId,
            userPersonId,
            optionPersonId,
            assetNumbers,
            VPNAccountRecovery,
        } = this.getParam()

        const result = await getBackDataApi(
            startDate,
            endDate,
            returnPersonId,
            userPersonId,
            optionPersonId,
            assetNumbers,
            VPNAccountRecovery
        )
        if (result.errMsg === 'OK') {
            this.setState({
                selectRowKeys: [],
                data: result.data,
                loading: false
            })
        } else {
            this.setState({
                selectRowKeys: [],
                data: [],
                loading: false
            })
        }
    }

    //选择某行时，传递key
    onSelectChange = selectedRowKeys => {
        this.setState({
            selectRowKeys: selectedRowKeys
        })
    }


    handleCancelButton = () => {
        const { selectRowKeys: [id] } = this.state;
        cancelItem('assetBack', id, this.getData)
    }

    handleBackButton = () => {
        Modal.confirm({
            width: 450,
            title: '确认归还',
            content: <UseForm formInstance={this.useForm}
                projectId={this.props.projectId}
                type='assetBackButton'
                setId={(id) => { this.Id = id }}
            />,
            centered: true,
            okText: '确认',
            cancelText: '取消',
            okButtonProps: {
                loading: false
            },
            onOk: (e) => {
                return new Promise(async (resolve, reject) => {

                    const { Remark, ReturnPersonName: returnPersonId, VPNAccountRecovery } = await this.useForm.current.validateFields();
                    if (this.Id) {
                        const result = await insertComputerBack(this.Id, returnPersonId, VPNAccountRecovery, Remark)

                        if (result === 'OK') {
                            message.success('归还成功');
                            this.getData();
                            resolve();
                        } else {
                            message.error(result)
                            return reject()
                        }
                    } else {
                        message.error('Id错误，不能归还')
                    }
                })
            }
        })
    }

    render() {
        const { data, selectRowKeys, loading } = this.state

        return <Card title={<ToolBarOperateComponent
            formInstance={this.toolbar}
            getData={this.getData}
            type={'assetBack'}
        />
        }
            extra={<Space>
                <Button type='primary' icon={<CloseOutlined />} onClick={this.handleCancelButton} disabled={!selectRowKeys.length > 0}>作废</Button>
                <Button type='primary' icon={<IssuesCloseOutlined />} onClick={this.handleBackButton}> 归还</Button>
            </ Space>}
            bordered={false}>

            <Table bordered
                dataSource={data}
                rowKey='Id'
                loading={loading}
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectRowKeys,
                    onChange: this.onSelectChange
                }}
                onRow={record => {
                    return {
                        onClick: () => {
                            this.onSelectChange([record.Id])
                        }
                    }
                }}
                pagination={{
                    showSizeChanger: false
                }}
            >
                <Column title="序号" dataIndex='RowId' />
                <Column title="资产编号" dataIndex='AssetNumbers' />
                <Column title="资产名称" dataIndex='AssetsName' />
                <Column title="资产类别" dataIndex='AssetsType' />
                <Column title="归还人" dataIndex='ReturnPersonName' />
                <Column title="部门" dataIndex='DepartName' />
                <Column title="使用人" dataIndex='UserPersonName' />
                <Column title="数量" dataIndex='ReturnNum' />
                <Column title="归还操作人" dataIndex='OptionPersonName' />
                <Column title="归还日期" dataIndex='ReturnTime' />
                <Column title="VPN账号" dataIndex='VPNAccountRecovery'
                    render={(text, record) => {
                        const { Id, VPNAccountRecovery, VPNAccountRecoveryName } = record
                        return <Button type='primary' shape="round"
                            onClick={(e) => {
                                e.stopPropagation()
                                updateComputerVPNApi(Id, (VPNAccountRecovery + 1) & 1);//~VPNAccountRecovery & 1

                                this.getData()
                            }}
                        >{VPNAccountRecoveryName}</Button>
                    }}
                />
                <Column title="备注" dataIndex='Remark' />
            </Table>
        </Card>
    }
}




class UseForm extends React.Component {
    constructor(props) {
        super(props)
        this.type = props.type
        this.initData = props.initData ?? {}
    }

    state = {
        AssetsNameList: [],
        AssetsNameTypeList: [],
        //CompanyList: []
    }

    componentDidMount() {
        if (this.type === 'assetUse') {
            this.getAssetsNameList();
            //this.getCompanyRegionList();
        }
    }

    getAssetsNameList = async () => {
        const result = await getAssertName(this.props.projectId)
        this.setState({
            AssetsNameList: result ?? []
        })
    }

    getAssetsNameTypeList = async (assertId) => {
        const result = await getAssertType(assertId)
        this.setState({
            AssetsNameTypeList: result ?? []
        })
    }

    getCompanyRegionList = async () => {
        const result = await getCompanyRegion(this.props.projectId)
        this.setState({
            CompanyList: result ?? []
        })
    }

    handleOnChange = (record) => {
        this.props.formInstance.current.resetFields(['AssetsNameType'])
        this.getAssetsNameTypeList(record)
    }


    handleAssNumberSearch = async () => {
        //获取资产编号对应的资产，回填到表单
        const assetNumbers = this.props.formInstance.current.getFieldValue(['AssetNumbers']);
        const result = await getComputerAssetNumbers(assetNumbers)
        if (result.errMsg === 'OK') {
            this.props.setId(result.data[0].Id);
            this.props.formInstance.current.setFieldsValue({
                AssetsName: result.data[0].AssetsName,
                AssetsType: result.data[0].AssetsTypeName,
                UserPersonName: result.data[0].UserPersonName,
                Id: result.data[0].Id
            })
        } else {
            this.props.setId(null);
            this.props.formInstance.current.resetFields();
            message.error(result.errMsg)
        }
    }

    render() {
        const { AssetsNameList, AssetsNameTypeList } = this.state

        return <Form
            ref={this.props.formInstance}
            layout='horizontal'
            labelCol={{ span: 7 }}
            initialValues={this.initData}
        >
            {
                this.type === 'assetBackButton' ? <Form.Item
                    label="资产编号"
                >
                    <Form.Item
                        name="AssetNumbers"
                        rules={[{ required: true, message: '请输入资产编号!' }]}
                        noStyle
                    >
                        <Input placeholder='请输入资产编号'
                            style={{ width: 150, display: 'inline-block' }}
                        />
                    </Form.Item>
                    <span>
                        <Button type='primary' onClick={this.handleAssNumberSearch}>查找</Button>
                    </span>
                </Form.Item> :
                    <Form.Item
                        label="资产编号"
                        name="AssetNumbers"
                        rules={[{ required: true, message: '请输入资产编号!' }]}
                    >
                        <Input disabled={!(this.type === 'assetUse')} placeholder='请输入资产编号' />
                    </Form.Item>
            }

            <Form.Item
                label="资产名称"
                name="AssetsName"
                rules={[{ required: true, message: '请输入资产名称!' }]}
            >
                <Select onChange={this.handleOnChange} disabled={!(this.type === 'assetUse')} placeholder='请选择资产名称' >
                    {
                        AssetsNameList.map((item) => <Option value={item.AssetsId} key={item.AssetsId}>{item.AssetsName}</Option>)
                    }
                </Select>
            </Form.Item>

            <Form.Item
                label="资产类别"
                name="AssetsType"
                rules={[{ required: true, message: '请选择资产类别!' }]}
            >
                <Select disabled={!(this.type === 'assetUse')} placeholder='请选择资产类别'>
                    {
                        AssetsNameTypeList.map((item) => <Option value={item.AssetsTypeId} key={item.AssetsTypeId}>{item.AssetsType}</Option>)
                    }
                </Select>
            </Form.Item>
            {
                this.type === 'assetUse' ? <Form.Item
                    label="领用人"
                    name="ReceivePersonName"
                    rules={[{ required: true, message: '请输入领用人!' }]}
                >
                    <InputNumber style={{ width: 240 }} placeholder='请输入领用人卡号' />
                </Form.Item> : <Form.Item
                    label="归还人"
                    name="ReturnPersonName"
                    rules={[{ required: true, message: '请输入归还人!' }]}
                >
                    <InputNumber style={{ width: 240 }} placeholder='请输入归还人卡号' />
                </Form.Item>
            }

            <Form.Item
                label="使用人"
                name="UserPersonName"
                rules={[{ required: true, message: '请输入使用人!' }]}
            >
                <InputNumber style={{ width: 240 }} disabled={!(this.type === 'assetUse')} placeholder='请输入使用人卡号' />
            </Form.Item>

            {
                this.type === 'assetUse' ? <Form.Item
                    label="地点"
                    name="OptionCenter"
                    rules={[{ required: true, message: '请选择地点!' }]}
                >
                    <Select disabled={!(this.type === 'assetUse')} placeholder='请选择地点'>
                        <Option value="1">云集</Option>
                        <Option value="4">佛山</Option>
                        {/* {
                            CompanyList.map((item) => <Option value={item.CompanyId} key={item.CompanyId}>{item.CompanyName}</Option>)
                        } */}
                    </Select>
                </Form.Item> : null
            }


            {
                this.type === 'assetUse' ?
                    <Form.Item
                        label="VPN账户"
                        name="VPNAccount"
                    >
                        <Input placeholder='请输入VPN账户' />
                    </Form.Item> :
                    <Form.Item
                        label="VPN账户回收"
                        name="VPNAccountRecovery"
                        rules={[{ required: true, message: '请选择!!!' }]}
                    >
                        {
                            <Radio.Group>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </Radio.Group>
                        }

                    </Form.Item>

            }
            <Form.Item
                label="备注"
                name="Remark"
            >
                <TextArea showCount maxLength={100} placeholder='备注' />
            </Form.Item>
        </Form>
    }
}