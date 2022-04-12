/*
 * @Author: Mr.Q
 * @Date: 2021-10-19 15:47:53
 * @LastEditTime: 2022-03-28 13:20:24
 * @Description: 
 */
import { useEffect } from 'react'
import { Layout } from 'antd';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import MenuComponent from "./components/MenuComponent";
import 'antd/dist/antd.css';
import logo from './logo.jpeg'

import RegVpn from './pages/RegVpn'
import RegHeadphone from './pages/RegHeadphone'
import LoseOrChangeHeadphone from './pages/LoseOrChangeHeadphone'

import ApprovalVpn from './pages/ApprovalVpn'
import ApprovalEquipment from './pages/ApprovalEquipment'
import OperateVpn from './pages/OperateVpn'
import ReturnHeadphone from './pages/ReturnHeadphone'
import OperateComputer from './pages/OperateComputer'
import Home from "./pages/Home";

import { getPersonApi } from './api/index'
import cookie from 'react-cookies'
import { message } from 'antd'
import './App.css'


const { Sider, Content } = Layout;
function App() {
    useEffect(() => {
        cookie.save('PHPSESSID', '1et3kv361t84oe97u3jub4f8d3')
        cookie.save('wnPersonId', '2021639')
        cookie.save('wnSessionKey', 'd8bddc553f3995c695335d1f1de23c92')

        //根据cookie 获取 person
        getPersonDetail()
    }, [])

    //获取登录人信息
    const getPersonDetail = async () => {
        const personId = cookie.load('wnPersonId')
        if (personId) {
            const result = await getPersonApi(personId)
            if (result.errMsg === 'OK') {
                sessionStorage.setItem('personDetail', JSON.stringify(result.data[0]))
            } else {
                sessionStorage.setItem('personDetail', '')
            }
            return
        }

        message.error('未获取到cookie信息')
    }
    return (
        <HashRouter>
            <Layout className='App'>
                <Sider>
                    <div className='App-logo'>
                        <img src={logo} alt="logo" />
                    </div>
                    <MenuComponent />
                </Sider>
                <Layout>
                    <Content style={{ padding: '10px' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/apply/email' component={RegVpn} />
                            <Route path='/apply/equipment/apply' component={RegHeadphone} key={'apply_equipment'} />
                            <Route path='/apply/equipment/lose' component={LoseOrChangeHeadphone} key={'lose_equipment'}></Route>
                            <Route path='/apply/equipment/change' component={LoseOrChangeHeadphone} key={'change_equipment'}></Route>

                            <Route path='/approval/email' component={ApprovalVpn} />
                            <Route path='/approval/equipment' component={ApprovalEquipment} />

                            <Route path='/option/email' component={OperateVpn} />
                            <Route path='/option/equipment/apply' component={RegHeadphone} key={'option_equipment'} />

                            <Route path='/option/equipment/return' component={ReturnHeadphone} />
                            <Route path='/option/computer' component={OperateComputer} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </HashRouter>
    );
}

export default App;
