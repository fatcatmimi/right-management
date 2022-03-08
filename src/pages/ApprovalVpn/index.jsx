import React from 'react'
import {Button, Card, Table, Space, Modal, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ToolBarForm from "../../components/ToolBar/ToolBarForm";
import DepartAndSpecialModal from "./DepartAndSpecialModal/DepartAndSpecialModal";
import FunctionsModal from "./FunctionsModal/FunctionsModal";
import {getApprovalMailApi} from "../../api";
import {PageSize} from "../../config/memory_config";

export default class ApprovalVpn extends React.Component{
    constructor() {
        super();
        this.toolBarRef = React.createRef()
        this.state={
            data:[],
            visible : 0,
            buttonStatus:0,
            loading:false,
            selectRowKeys:[]
        }
    }

    closeWindow = () =>{
        this.setState({
            visible:0,
            selectRowKeys:[],
            buttonStatus:0
        })
    }

    componentDidMount() {
        try{
            this.projectId = this.props.location.state.projectId;
            this.getData()
        }catch(e){
            this.props.history.push('/home')
        }

    }

    // getPersonList=()=>{
    //     const row =this.getParam()
    //     console.log(row)
    //     //console.log(getApprovalOperatePersonList())
    // }

    getParam=()=>{
        const {data} = this.state
        return data.find((value)=>value.workId === this.state.selectRowKeys[0])
    }

    getData = async (e,begin = 1,end=10) =>{
        this.setState({loading:true})
        const {searchStatus,searchDate:[searchStartDate,searchEndDate]} = await this.toolBarRef.current.validateFields();
        getApprovalMailApi(
            searchStatus,
            this.projectId,
            searchStartDate.format('YYYY-MM-DD'),
            searchEndDate.format('YYYY-MM-DD'),
            begin,
            end
        ).then((result)=>{
                if(result.errMsg !== 'OK'){
                    message.info(result.errMsg)
                }
                this.setState({
                    data:result.data,
                    total:result.total,
                })

            }).finally(()=>{
            this.setState({
                loading:false
            })
        })
    }

    //选择某行时，传递key
    onSelectChange=selectedRowKeys=>{
        const row = this.state.data.find((value)=>{
            return value.workId == selectedRowKeys
        })
        const {BTreview} = row

        this.setState({
            buttonStatus:BTreview,
            selectRowKeys:selectedRowKeys
        })
    }

    render(){
        const {loading,total,data,selectRowKeys,buttonStatus} = this.state
        const rowSelection = {
            type:'radio',
            selectedRowKeys: selectRowKeys,
            onChange: this.onSelectChange
        };
        const extra  = (<Space>
            <Button icon={<PlusOutlined />}  type='primary'  disabled={(buttonStatus&1)!==1}  onClick={()=>this.setState({visible:1})}>部门审批</Button>
            <Button icon={<PlusOutlined />}  type='primary'  disabled={(buttonStatus&2)!==2}  onClick={()=>this.setState({visible:2})}>职能审批</Button>
            <Button icon={<PlusOutlined />}  type='primary'  disabled={(buttonStatus&4)!==4}  onClick={()=>this.setState({visible:3})}>特权审批</Button>
            </Space>
            )
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
            },{
                title: '申请人',
                dataIndex: 'PersonName',
            },{
                title: '部门',
                dataIndex: 'DepartName',
            },{
                title: '状态',
                dataIndex: 'ApplyStatus',
            },{
                title: '状态描述',
                dataIndex: 'StatusDescription',
            },{
                title: '邮箱',
                dataIndex: 'Email',
            },{
                title: '备注',
                dataIndex: 'ApplyRemark',
            },
        ]
        return <>
                <Card title={<ToolBarForm
                            formInstance={this.toolBarRef}
                            getData={this.getData}
                            selectData = {{title:'审批状态',data:[{title:'所有',value:'-1'},
                                    {title:'已审批',value:'2'},
                                    {title:'未审批',value:'1'}]}}
                />} extra={extra} >
                    <Table columns={columns}
                           bordered
                           rowKey={'workId'}
                           loading={loading}
                           dataSource={data}
                           pagination={{
                               pageSize:PageSize,
                               total:total,
                               onChange:(pageNumber, pageSize)=>{
                                   var begin=(pageNumber-1)*pageSize+1;
                                   var end=pageNumber*pageSize;

                                   this.getData(null,begin,end)
                               }
                           }}
                           rowSelection={rowSelection}
                           onRow = {record =>{
                               return {
                                   onClick:()=>{
                                       this.onSelectChange([record.workId])
                                   }
                               }
                           }}
                    />
                </Card>
                <DepartAndSpecialModal visible={this.state.visible}  closeWindow={this.closeWindow} getParam={this.getParam} getData={this.getData}/>
                <FunctionsModal visible={this.state.visible} projectId={this.projectId} closeWindow={this.closeWindow} getParam={this.getParam} getData={this.getData}/>
              </>

    }
}