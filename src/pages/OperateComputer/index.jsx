import React from 'react'
import { AssetUse, AssetBack } from './TabPaneList.jsx'
import { Tabs } from 'antd'
import './tab.css'

const { TabPane } = Tabs;

export default class OperateComputer extends React.Component {
    assetUse = React.createRef()
    assetBack = React.createRef()

    state = {
        data: [],
        activeKey: 'assetUse'
    }

    componentWillMount() {
        try {
            this.projectId = this.props.location.state.projectId;
        } catch (e) {
            this.props.history.push('/home')
        }
    }

    componentDidMount() {
        if (this.state.activeKey === 'assetUse') {
            this.assetUse.current.getData()
        }
    }


    handleChangeTab = (activeKey) => {
        this.setState({
            activeKey: activeKey
        }, () => {
            if (activeKey === 'assetUse') {
                this.assetUse.current.getData()
            } else if (activeKey === 'assetBack') {
                this.assetBack.current.getData()
            }
        })
    }

    render() {
        const { activeKey } = this.state
        return (
            <div className="card-container">
                <Tabs type="card"
                    onChange={this.handleChangeTab}
                    activeKey={activeKey}
                >
                    <TabPane tab='资产领用' key='assetUse'>
                        <AssetUse ref={this.assetUse} projectId={this.projectId} changeTab={this.handleChangeTab} />
                    </TabPane>
                    <TabPane tab='资产归还' key='assetBack'>
                        <AssetBack ref={this.assetBack} projectId={this.projectId} />
                    </TabPane>
                </Tabs>
            </div>

        )
    }
}

