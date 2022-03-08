import React from 'react'
import { Card, Table, Button, message, Modal } from "antd";
import { getOperateMailDataApi, sendEmail, updateOperateMailDataApi } from "../../api";
import ToolBarForm from "../../components/ToolBar/ToolBarForm";
import { PageSize } from "../../config/memory_config";
import SendEmail from '../../components/SendEmail/SendEmail'

export default class OperateVpn extends React.Component {
    constructor() {
        super();
        this.toolBarRef = React.createRef()

        this.formInstance = React.createRef()

        this.state = {
            total: 0,
            loading: false,
            data: [],
            buttonLoading: false
        }
    }

    //获取数据
    getData = async (e, begin = 1, end = 10) => {
        this.setState({ loading: true })
        const { searchStatus, searchDate: [searchStartDate, searchEndDate] } = await this.toolBarRef.current.validateFields();

        getOperateMailDataApi(
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

    componentDidMount() {
        try {
            this.projectId = this.props.location.state.projectId;
            this.getData()
        } catch (e) {
            this.props.history.push('/home')
        }

    }

    sendEmail = (record) => {
        Modal.confirm({
            title: '邮件发送',
            centered: true,
            width: 800,
            content: <SendEmail formInstance={this.formInstance} />,
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const result = await this.formInstance.current.validateFields()
                        if (result.messageText) {
                            const subject = '企业邮箱开通信息'
                            const content = result.messageText

                            const mailfrom = `${record.OptionPersonName}`
                            const mailTo = `${record.ApplyPersonName}<${record.ApplyPersonId}>`

                            const id_list = record.ApplyPersonId
                            const sendMessage = await sendEmail(
                                subject,
                                content,
                                mailfrom,
                                mailTo,
                                id_list
                            )
                            if (sendMessage === 'OK') {
                                resolve()
                                const updateMessage = await updateOperateMailDataApi(record.OptionPersonId, record.workId)
                                if (updateMessage.errMsg === 'OK') {
                                    this.getData()
                                } else {
                                    message.error(updateMessage.errMsg)
                                }

                            } else {
                                message.error(sendMessage)
                            }

                        }
                    } catch (e) {
                        reject('未能获取邮件内容')
                    } finally {
                        this.setState({ buttonLoading: false })
                    }
                })
            },
            okText: '发送',
            cancelText: '取消',
            okButtonProps: {
                loading: this.setState.buttonLoading
            }
        })
    }

    render() {
        const { data, total } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'rowId'
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
                dataIndex: 'OptionPersonName',
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
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    return <Button type='primary' disabled={record.colorid == 0} onClick={() => { this.sendEmail(record) }} >完成</Button>
                }
            }
        ]
        return <Card title={<ToolBarForm formInstance={this.toolBarRef} getData={this.getData}
            selectData={{ title: '操作状态', data: [{ title: '所有', value: '-1' }, { title: '已操作', value: '2' }, { title: '未操作', value: '1' }] }}
        />}  >
            <Table columns={columns}
                bordered
                dataSource={data}
                rowKey={'workId'}
                pagination={{
                    pageSize: PageSize,
                    total: total,
                    onChange: (pageNumber, pageSize) => {
                        var begin = (pageNumber - 1) * pageSize + 1;
                        var end = pageNumber * pageSize;

                        this.getData(null, begin, end)
                    }
                }} />
        </Card>
    }
}