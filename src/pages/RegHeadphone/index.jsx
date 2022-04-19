import React from 'react'
import { Card, Button, Space, Table, Modal, message, Popconfirm, Form, Input } from 'antd';
import { DownloadOutlined, CloseOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import ToolBarHeadphone from '../../components/ToolBar_Headphone/ToolBar_Headphone';
import HeadApplyForm from './HeadApplyForm';
import { PageSize } from '../../config/memory_config';
import { checkPersonId } from '../../tools/index';
import { downFile, getBatchId, uploadFileHeadPhone, getEquipmentData, deleteBatchId, updateRegion, rejectReason } from '../../api';

const { Column } = Table;
export default class RegHeadphone extends React.Component {
    myRefWindow = React.createRef();
    myRef = React.createRef();

    state = {
        data: [],
        loading: false,
        total: 0,
        status: '1',
        stateId: '-1',
        batchArray: [],
        selectedRowKeys: []
    }

    componentDidMount() {
        const { status } = this.getToolBarParam();
        this.getBatchArray(status)
    }


    getToolBarParam = () => {
        return this.myRef.current.getFieldsValue()
    }

    //获取batchArray
    getBatchArray = async (status) => {
        if (this.projectId) {
            const batchArray = await getBatchId(this.projectId, status, this.type);
            if ((batchArray ?? []).length > 0) {
                this.myRef.current.setFieldsValue({
                    batch: batchArray[0].BatchId
                })
                this.getData()
            }
            this.setState({
                batchArray
            })
        }

    }

    submitApply = async () => {

        const { asset_category: assetCategory, asset_name: assetName, upload, personId } = await this.myRefWindow.current.validateFields()

        return new Promise((resolve, reject) => {
            let formData = new FormData();

            formData.append('projectId', this.projectId);
            formData.append('assetCategory', assetCategory);
            formData.append('assetName', assetName);

            if (upload) {
                //formData.append('file', upload[0].originFileObj);

                let reads = new FileReader();
                reads.readAsText(upload[0].originFileObj, 'utf-8');
                reads.onload = (e) => {
                    var stringResult = e.target.result.split('\r\n');
                    let personList = stringResult.filter((item) => {
                        if (item !== '') {
                            return checkPersonId(item);
                        }
                        return false
                    })
                    if (personList.length > 0) {
                        const personListString = Array.from(new Set(personList)).join(',');
                        formData.append('personId', personListString);
                        uploadFileHeadPhone(formData).then(response => {
                            if (response !== 'OK') {
                                message.error(response);
                                reject(response);
                            } else {
                                message.success('添加成功');
                                //获取批次
                                const { status } = this.getToolBarParam()
                                this.getBatchArray(status)
                                resolve();
                            }
                        });
                    } else {
                        message.error('文件为空');
                        return;
                    }
                }
            } else {
                formData.append('personId', personId);
                uploadFileHeadPhone(formData).then(response => {
                    if (response !== 'OK') {
                        message.error(response);
                        reject(response);
                    } else {
                        message.success('添加成功');
                        //获取批次
                        const { status } = this.getToolBarParam()
                        this.getBatchArray(status)
                        resolve();
                    }
                });
            }
        })
    }

    handleApply = () => {
        Modal.confirm({
            width: 500,
            title: '申请',
            centered: true,
            okText: '提交',
            cancelText: '取消',
            content: <HeadApplyForm
                projectId={this.projectId}
                formRef={this.myRefWindow}
            />,
            onOk: this.submitApply
        })
    }

    handleCancel = () => {
        const { batch } = this.getToolBarParam()

        if (batch) {
            Modal.confirm({
                title: '确认',
                cancelText: '取消',
                okText: '删除',
                centered: true,
                content: `是否删除批号:${batch}`,
                onOk: async () => {
                    const response = await deleteBatchId(this.projectId, batch);
                    if (response === 'OK') {
                        message.success('删除批次成功');
                        this.popBatch(batch)
                        this.getData()
                    } else {
                        message.error('删除批次失败');
                    }
                }
            })
        } else {
            message.error('请选择批号！！！')
        }

    }

    //获取workflowId
    checkHasSelectRow = () => {
        if (this.state.selectedRowKeys.length > 0) {
            const row = this.state.data.filter(item => {
                return item.workflowId === this.state.selectedRowKeys[0]
            })
            if (row.length > 0) {
                return row[0].workflowId
            } else {
                return -1;
            }
        } else {
            const errorMessage = {
                message: '请选择一行记录'
            }
            throw (errorMessage)
        }
    }

    handleComplete = () => {
        const { batch, stateId } = this.getToolBarParam()
        let workflowId = -1;
        if (parseInt(stateId) === 5 || parseInt(stateId) === 7) {
            try {
                workflowId = this.checkHasSelectRow()
            } catch (e) {
                message.error(e.message);
                return
            }

        }

        const propF = (where) => ({
            title: '是否选择该地区?',
            cancelText: '取消',
            okText: '确认',
            onConfirm: () => {
                return new Promise(async (resolve) => {
                    const result = await updateRegion(this.projectId, batch, where, workflowId, stateId);

                    if (result === 'OK') {
                        this.popBatch(batch)
                        message.success('更新成功')
                        this.getData()
                        Modal.destroyAll();
                        return resolve();
                    } else {
                        message.error(result)
                    }
                })

            }
        })

        if (batch) {
            Modal.info({
                width: 300,
                title: '请选择区域',
                okText: '提交',
                centered: true,
                closable: true,
                content:
                    <Space size={'large'} direction={'vertical'}>
                        <Popconfirm {...(propF(1))}>
                            <Button type="primary" size={'large'} style={{ width: 150 }}>云集</Button>
                        </Popconfirm>
                        <Popconfirm {...(propF(4))}>
                            <Button type="primary" size={'large'} style={{ width: 150 }}>智富</Button>
                        </Popconfirm>
                    </Space>,
                okButtonProps: { style: { display: 'none' } }
            })
        } else {
            message.error('请选择批号！！！')
        }
    }

    handleReject = () => {
        const { batch, stateId } = this.getToolBarParam()

        const onFinish = async (value) => {

            const { reason } = value
            let workflowId = -1
            if (parseInt(stateId) === 5 || parseInt(stateId) === 7) {
                try {
                    workflowId = this.checkHasSelectRow()
                } catch (e) {
                    console.log(e)
                    message.error(e.message);
                    return
                }
            }

            const result = await rejectReason(this.projectId, batch, reason, workflowId, stateId);

            if (result === 'OK') {
                this.popBatch(batch)
                this.getData()
                Modal.destroyAll();
            } else {
                message.error(result);
            }
        }
        if (batch) {
            Modal.info({
                width: 500,
                title: '请填写原因',
                okText: '提交',
                centered: true,
                closable: true,
                content:
                    <Form
                        onFinish={onFinish}
                        initialValues={{ reson: '' }}
                    >
                        <Form.Item
                            name="reason"
                            label="驳回原因"
                            rules={[{ required: true, message: '请填写驳回原因' }]}
                        >
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>,
                okButtonProps: { style: { display: 'none' } }
            })
        } else {
            message.error('请选择批号！！！')
        }
    }

    getData = async (begin = 1, end = 10) => {
        const { status, batch, stateId } = this.getToolBarParam()

        if (!batch) {
            this.setState({ data: [] })
            return
        }

        this.setState({ loading: true });

        try {
            const result = await getEquipmentData(this.projectId, status, batch, this.type, stateId, begin, end)
            this.setState({
                data: result.data,
                total: result.total
            });
        } catch (e) {
            message.error('请求错误')
        } finally {
            this.setState({
                loading: false
            })
        }
    }

    clearData = () => {
        this.setState({
            data: [],
            total: 0
        })
    }

    handleChangeStatus = (status) => {
        this.setState({ status })
    }

    handleChangeStateId = (stateId) => {
        this.setState({ stateId })
    }

    //从当前申请批次中删除当前的
    popBatch = (batch) => {
        const { batchArray } = this.state
        if (batchArray.length > 0) {
            const newBatchArry = batchArray.filter((item) => item.BatchId !== batch)

            this.setState({
                batchArray: newBatchArry ?? []
            }, () => {
                console.log('newBatcharry:', batchArray)
                if (newBatchArry.length > 0) {
                    this.myRef.current.setFieldsValue({
                        batch: newBatchArry[0].BatchId
                    })
                } else {
                    this.myRef.current.setFieldsValue({
                        batch: ''
                    })
                }
            })
        }
    }


    handleRowSelect = (selectedRowKeys) => {
        this.setState({ selectedRowKeys: [selectedRowKeys] })
    }

    handleClickRow = (record) => {
        const { workflowId } = record
        this.setState({ selectedRowKeys: [workflowId] })
    }

    render() {
        //区分
        const { pathname, state } = this.props.location
        const { data, total, loading, batchArray, status, selectedRowKeys, stateId } = this.state

        try {
            this.projectId = state.projectId
        } catch (e) {
            this.props.history.push('/home')
        }
        if (pathname === '/apply/equipment/apply') {
            this.type = 1;
            this.extra = (
                <Space>
                    <Button danger icon={<CloseOutlined />} onClick={this.handleCancel} disabled={status === '-1' ? true : false}>作废</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={this.handleApply} disabled={status === '-1' ? true : false}>申请</Button>
                    <a href={`${downFile}/话务设备申请流程.pdf`}
                        download="话务设备申请流程.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Button type="primary" shape="round" icon={<DownloadOutlined />}>
                            帮助
                        </Button>
                    </a>
                </Space>
            )
        } else {
            this.type = 4;
            this.extra = (
                <Space>
                    <Button type="primary" icon={<CheckOutlined />} onClick={this.handleComplete} disabled={stateId !== "-1" ? false : true}>完成</Button>
                    <Button type="primary" icon={<CloseOutlined />} onClick={this.handleReject} disabled={stateId !== "-1" ? false : true}>驳回</Button>
                </Space>
            )
        }

        return <>
            <Card title={<ToolBarHeadphone
                type={this.type}
                getData={this.getData}
                formInstance={this.myRef}
                batchArray={batchArray}
                clearData={this.clearData}
                getBatchArray={this.getBatchArray}
                handleChangeStatus={this.handleChangeStatus}
                handleChangeStateId={this.handleChangeStateId}
            />}
                extra={this.extra}>
                <Table bordered
                    dataSource={data}
                    loading={loading}
                    rowKey={'workflowId'}
                    size={'small'}
                    pagination={{
                        showSizeChanger: false,
                        pageSize: PageSize,
                        total: total,
                        onChange: (pageNumber, pageSize) => {
                            var begin = (pageNumber - 1) * pageSize + 1;
                            var end = pageNumber * pageSize;
                            this.getData(begin, end)
                        }
                    }}
                    rowSelection={parseInt(this.type) === 4 ? {
                        type: 'radio',
                        onChange: this.handleRowSelect,
                        selectedRowKeys: selectedRowKeys
                    } : null}
                    onRow={record => {
                        return {
                            onClick: event => { this.handleClickRow(record) }, // 点击行
                        };
                    }}
                >
                    <Column title="序号" dataIndex="rowId" />
                    <Column title="动作" dataIndex="StateName" />
                    <Column title="资产名称" dataIndex="AssetsName" />
                    <Column title="资产类别" dataIndex="AssetsType" />
                    <Column title="申请人" dataIndex="ApplyPersonName" />
                    <Column title="部门" dataIndex="DeptName" />
                    <Column title="使用人" dataIndex="UserPersonName" />
                    <Column title="数量" dataIndex="ApplyNum" />
                    <Column title="申请日期" dataIndex="ApplyTime" />
                    <Column title="状态" dataIndex="ApplyStatus" />
                    <Column title="操作人" dataIndex="OptionPersonName" />
                    <Column title="地点" dataIndex="OptionCenter" />
                    <Column title="领用日期" dataIndex="OptionTime" />
                    <Column title="备注" dataIndex="OptionRemark" />
                </Table>
            </Card>
        </>

    }
}