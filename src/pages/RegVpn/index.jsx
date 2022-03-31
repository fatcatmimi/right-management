import React from 'react'
import { ConfigProvider, Card, Button, Table, Modal, Popconfirm, message } from 'antd';
import ToolBarForm from "../../components/ToolBar/ToolBarForm";
import AddMailForm from "./AddForm/AddForm";
import { PlusOutlined } from '@ant-design/icons'
import { PageSize } from "../../config/memory_config";
import { getMailDataApi, deleteMailApi, addMailApi, getMailDetailDataApi } from '../../api/index'
import zhCN from 'antd/es/locale/zh_CN'

const { Column } = Table;
export default class RegVpn extends React.Component {
    constructor() {
        super();
        this.addEmailRef = React.createRef()

        this.state = {
            data: [],
            total: 0,
            loading: false,
            buttonStatus: true,
            detailData: [],
            showDetailTable: false,
            selectRowKeys: []
        }
    }

    componentDidMount() {
        try {
            this.projectId = this.props.location.state.projectId;
            this.getData()
        } catch (e) {
            this.props.history.push('/home')
        }

    }

    //获取数据
    getData = async (e, begin = 1, end = 10) => {
        this.setState({ loading: true })
        const { searchStatus, searchDate: [searchStartDate, searchEndDate] } = await this.addEmailRef.current.validateFields();

        getMailDataApi(searchStatus,
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

    //申请mail
    okHandle = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const { mail, messageText } = await this.addEmailRef.current.validateFields();
                const response = await addMailApi(mail, messageText, this.projectId)

                if (response.errMsg === 'OK') {
                    resolve()
                    message.success('申请成功');
                    await this.getData()
                } else {
                    message.error(response.errMsg)
                }
            } catch (e) {
                reject('参数错误')
            }

        })
    }
    // okHandle = async () =>{
    //     try{
    //         const {mail,messageText} = await this.addEmailRef.current.validateFields();
    //
    //         const response = await addMailApi(mail,messageText,MAIL_PROJECTID)
    //
    //         if(response.errMsg === 'OK'){
    //             Modal.destroyAll();
    //             message.success('申请成功');
    //             await this.getData()
    //         }else{
    //             message.error(response.errMsg)
    //         }
    //     }catch(e){
    //         console.log()
    //     }
    //
    // }

    //删除
    confirmDelete = ({ workId }) => {
        deleteMailApi(workId).then((response) => {
            if (response.errMsg === 'OK') {
                message.success('删除成功')
                this.getData()
                return
            }
            message.error(response.errMsg)
        })
    }

    //申请modal框
    applyMail = () => {
        Modal.confirm({
            width: 700,
            title: '添加申请',
            centered: true,
            content: <AddMailForm formInstance={this.addEmailRef} />,
            onOk: this.okHandle,
            okButtonProps: {
                loading: false
            },
            okText: '确认',
            cancelText: '取消'
        });
    }

    //选择某行时，传递key
    onSelectChange = selectedRowKeys => {
        this.setState({
            buttonStatus: false,
            showDetailTable: false,
            selectRowKeys: selectedRowKeys
        })
    }

    //查看流程
    getDetailData = async () => {
        this.setState({ showDetailTable: true })
        const selectRowKey = this.state.selectRowKeys[0] || ''
        if (selectRowKey) {
            //发送请求
            const result = await getMailDetailDataApi(selectRowKey)
            if (result.errMsg === 'OK') {
                this.setState({
                    detailData: result.data
                })
            }
        } else {
            message.error('没有选择行')
        }
    }

    render() {
        const { data, total, loading, buttonStatus, showDetailTable, detailData, selectRowKeys } = this.state

        const extra = (<Button icon={<PlusOutlined />} type='primary' onClick={this.applyMail}>申请</Button>)
        const columns = [
            {
                title: '序号',
                dataIndex: 'rowId'
            },
            {
                title: '申请项目',
                dataIndex: 'ProjectName',
            },
            {
                title: '申请日期',
                dataIndex: 'ApplyTime',
            },
            {
                title: '申请原因',
                dataIndex: 'ApplyRemark',
            }, {
                title: '申请人',
                dataIndex: 'PersonName',
            }, {
                title: '状态',
                dataIndex: 'ApplyStatus',
            }, {
                title: '状态描述',
                dataIndex: 'StatusDescription',
            }, {
                title: '邮箱',
                dataIndex: 'Email',
            }, {
                title: '备注',
                dataIndex: 'ApplyRemark',
            }, {
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return <Popconfirm
                        title="是否确认删除?"
                        okText="是"
                        cancelText="否"
                        onConfirm={() => this.confirmDelete(record)}
                    >
                        <button type="text" >删除</button>
                    </Popconfirm>
                }
            },
        ]

        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectRowKeys,
            onChange: this.onSelectChange
        };

        return <Card title={<ToolBarForm formInstance={this.addEmailRef} getData={this.getData}
            selectData={{ title: '申请状态', data: [{ title: '所有', value: '-1' }, { title: '申请中', value: '1' }, { title: '已完成', value: '2' }] }}
        />} extra={extra} >
            <ConfigProvider local={zhCN}>
                <Table columns={columns}
                    rowKey={'workId'}
                    dataSource={data}
                    bordered
                    loading={loading}
                    pagination={{
                        pageSize: PageSize,
                        total: total,
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
            </ConfigProvider>

            <div style={{ marginTop: 30, width: "30%" }}>
                <Button type='primary' disabled={buttonStatus} onClick={() => {
                    this.getDetailData()
                }}>查看流程</Button>

                <div style={{ display: showDetailTable ? 'block' : 'none' }}>
                    <Table dataSource={detailData}
                        pagination={false}
                        rowKey={'Rowid'}
                        size='small'
                    >
                        <Column title="序号" dataIndex="Rowid" />
                        <Column title="操作人" dataIndex="OptionPersonName" />
                        <Column title="审批人" dataIndex="NextOptionPersonName" />
                        <Column title="详情" dataIndex="StatusDescription" />
                        <Column title="备注" dataIndex="ApprovalRemark" />
                    </Table>
                </div>

            </div>
        </Card>
    }
}