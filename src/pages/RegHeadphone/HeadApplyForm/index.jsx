import React from 'react'
import { Form, Radio, Select, InputNumber, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { getAssertName, getAssertType } from '../../../api'

const { Option } = Select
export default class HeadApplyForm extends React.Component {
    state = {
        value: 1,
        assertNameList: [],
        assertNameTypeList: [],
        fileList: []
    }

    componentWillMount() {
        this.formRef = this.props.formRef
    }

    componentDidMount() {
        getAssertName(this.props.projectId).then((response) => {
            this.setState({
                assertNameList: response
            })
        })
    }

    handleChangeRadio = (e) => {
        this.setState({ value: e.target.value })
    }

    //资产名称change事件
    handleAssetName = async (value) => {
        //清空type框
        this.formRef.current.resetFields(['asset_category'])
        //获取新值
        const result = await getAssertType(value)
        this.setState({
            assertNameTypeList: result
        })
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        this.uploadFile = e
        return e && e.fileList;
    };

    //上传验证
    checkPic = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length == 0) {
                reject(new Error('请上传文件'))
            } else if (!(value[0].name).endsWith('csv')) {
                reject(new Error('文件类型错误，类型为csv格式'))
            } else {
                resolve(value)
            }
        })
    }

    // //文件内容检查
    // getFileMimeType = (file) => {
    //     const reader = new FileReader()
    //     return new Promise((resolve, reject) => {
    //         reader.onload = (event) => {
    //             try {
    //                 let buffer = [...Buffer.from(event.target.result)];
    //                 buffer = buffer.slice(0, 4)
    //                 buffer.forEach((num, i, arr) => {
    //                     arr[i] = num.toString(16).padStart(2, '0');
    //                 })
    //                 reject('文件不合法')
    //             } catch (e) {
    //                 reject('文件不合法');
    //             }
    //         }
    //     })
    // }


    render() {
        const { value, assertNameList, assertNameTypeList } = this.state
        return <Form
            ref={this.formRef}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
        >
            <Form.Item
                label="申请方式"
            >
                <Radio.Group onChange={this.handleChangeRadio} value={value}>
                    <Radio value={1}>导入</Radio>
                    <Radio value={2}>添加</Radio>
                </Radio.Group>
            </Form.Item>
            {
                value === 1 ? <Form.Item
                    name="upload"
                    label="导入文件"
                    valuePropName="fileList"
                    getValueFromEvent={this.normFile}
                    extra='上传文件类型 .csv'
                    rules={[{ validator: this.checkPic }]}
                >
                    <Upload
                        accept={'.csv'}
                        name="logo"
                        maxCount={1}
                        // onRemove={file => {
                        //     this.setState({
                        //         fileList: []
                        //     })
                        // }}
                        onRemove={file => {
                            Promise.resolve(true)
                        }}
                        beforeUpload={
                            (file) => {
                                this.setState({
                                    fileList: [file]
                                })
                                return false
                            }}
                    >
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                    </Upload>
                </Form.Item> :
                    <Form.Item
                        label="输入卡号"
                        name="personId"
                        rules={[{ required: true, message: '请输入员工卡号!' }]}
                    >
                        <InputNumber placeholder='请输入员工卡号' min={2000000} max={2999999} style={{ width: 200 }} />
                    </Form.Item>
            }
            <Form.Item
                label="资产名称"
                name="asset_name"
                rules={[{ required: true, message: '请选择!' }]}
            >
                <Select
                    onChange={this.handleAssetName}
                >
                    {
                        (assertNameList ?? []).map((item) => <Option key={item.AssetsId} value={item.AssetsId}>{item.AssetsName}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                label="资产类别"
                name="asset_category"
                rules={[{ required: true, message: '请选择!' }]}
            >
                <Select>
                    {(assertNameTypeList ?? []).map((item) => <Option key={item.AssetsTypeId} value={item.AssetsTypeId}>{item.AssetsType}</Option>)}
                </Select>
            </Form.Item>
        </Form>
    }
}
