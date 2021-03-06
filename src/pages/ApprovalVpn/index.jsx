import React from 'react'
import { Button, Card, Table, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ToolBarForm from "../../components/ToolBar/ToolBarForm";
import DepartAndSpecialModal from "./DepartAndSpecialModal/DepartAndSpecialModal";
import FunctionsModal from "./FunctionsModal/FunctionsModal";
import { getApprovalMailApi } from "../../api";
import { PageSize } from "../../config/memory_config";

export default class ApprovalVpn extends React.Component {
    constructor() {
        super();
        this.toolBarRef = React.createRef()
        this.state = {
            data: [],
            visible: 0,
            buttonStatus: 0,
            loading: false,
            selectRowKeys: []
        }
    }

    closeWindow = () => {
        this.setState({
            visible: 0,
            selectRowKeys: [],
            buttonStatus: 0
        })
    }

    componentDidMount() {
        try {
            this.projectId = this.props.location.state.projectId;
            this.getData()
        } catch (e) {
            this.props.history.push('/home')
        }

    }

    // getPersonList=()=>{
    //     const row =this.getParam()
    //     console.log(row)
    //     //console.log(getApprovalOperatePersonList())
    // }

    getParam = () => {
        const { data } = this.state
        return data.find((value) => value.workId === this.state.selectRowKeys[0])
    }

    getData = async (e, begin = 1, end = 10) => {
        this.setState({ loading: true })
        const { searchStatus, searchDate: [searchStartDate, searchEndDate] } = await this.toolBarRef.current.validateFields();
        getApprovalMailApi(
            searchStatus,
            this.projectId,
            searchStartDate.format('YYYY-MM-DD'),
            searchEndDate.format('YYYY-MM-DD'),
            begin,
            end
        ).then((result) => {
            if (result.errMsg !== 'OK') {
                message.info(result.errMsg)
            }
            this.setState({
                data: result.data,
                total: result.total,
            })

        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    //????????????????????????key
    onSelectChange = selectedRowKeys => {
        const row = this.state.data.find((value) => {
            return parseInt(value.workId) === parseInt(selectedRowKeys)
        })
        const { BTreview } = row

        this.setState({
            buttonStatus: BTreview,
            selectRowKeys: selectedRowKeys
        })
    }

    render() {
        const { loading, total, data, selectRowKeys, buttonStatus } = this.state
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectRowKeys,
            onChange: this.onSelectChange
        };
        const extra = (<Space>
            <Button icon={<PlusOutlined />} type='primary' disabled={(buttonStatus & 1) !== 1} onClick={() => this.setState({ visible: 1 })}>????????????</Button>
            <Button icon={<PlusOutlined />} type='primary' disabled={(buttonStatus & 2) !== 2} onClick={() => this.setState({ visible: 2 })}>????????????</Button>
            <Button icon={<PlusOutlined />} type='primary' disabled={(buttonStatus & 4) !== 4} onClick={() => this.setState({ visible: 3 })}>????????????</Button>
        </Space>
        )
        const columns = [
            {
                title: '??????',
                dataIndex: 'rowId'
            },
            {
                title: '????????????',
                dataIndex: 'ApplyTime',
            },
            {
                title: '????????????',
                dataIndex: 'ApplyRemark',
            }, {
                title: '?????????',
                dataIndex: 'PersonName',
            }, {
                title: '??????',
                dataIndex: 'DepartName',
            }, {
                title: '??????',
                dataIndex: 'ApplyStatus',
            }, {
                title: '????????????',
                dataIndex: 'StatusDescription',
            }, {
                title: '??????',
                dataIndex: 'Email',
            }, {
                title: '??????',
                dataIndex: 'ApplyRemark',
            },
        ]
        return <>
            <Card title={<ToolBarForm
                formInstance={this.toolBarRef}
                getData={this.getData}
                selectData={{
                    title: '????????????', data: [{ title: '??????', value: '-1' },
                    { title: '?????????', value: '2' },
                    { title: '?????????', value: '1' }]
                }}
            />} extra={extra} >
                <Table columns={columns}
                    bordered
                    rowKey={'workId'}
                    loading={loading}
                    dataSource={data}
                    pagination={{
                        pageSize: PageSize,
                        total: total,
                        showSizeChanger: false,
                        onChange: (pageNumber, pageSize) => {
                            var begin = (pageNumber - 1) * pageSize + 1;
                            var end = pageNumber * pageSize;

                            this.getData(null, begin, end)
                        }
                    }}
                    rowSelection={rowSelection}
                    onRow={record => {
                        return {
                            onClick: () => {
                                this.onSelectChange([record.workId])
                            }
                        }
                    }}
                />
            </Card>
            <DepartAndSpecialModal visible={this.state.visible} closeWindow={this.closeWindow} getParam={this.getParam} getData={this.getData} />
            <FunctionsModal visible={this.state.visible} projectId={this.projectId} closeWindow={this.closeWindow} getParam={this.getParam} getData={this.getData} />
        </>

    }
}