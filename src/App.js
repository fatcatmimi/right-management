import { useEffect } from 'react'
import { Layout } from 'antd';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import MenuComponent from "./components/MenuComponent";
import 'antd/dist/antd.css';
import logo from './logo.jpeg'

import RegVpn from './pages/RegVpn'
import RegHeadphone from './pages/RegHeadphone'
import ApprovalVpn from './pages/ApprovalVpn'
import OperateVpn from './pages/OperateVpn'
import OperateComputer from './pages/OperateComputer'
import Home from "./pages/Home";

import { getPersonApi } from './api/index'
import cookie from 'react-cookies'
import { message } from 'antd'
import './App.css'


const { Sider, Content } = Layout;
function App() {
    useEffect(() => {
        cookie.save('PHPSESSID', '00k9k1191b02a2epabsb3sq8o0')
        cookie.save('wnPersonId', '2021639')
        cookie.save('wnSessionKey', 'd4d317246783f8ef1b36f2497f74ab61')

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
                            <Route path='/apply/equipment' component={RegHeadphone} key={'apply_equipment'} />
                            <Route path='/approval/email' component={ApprovalVpn} />
                            <Route path='/option/email' component={OperateVpn} />
                            <Route path='/option/equipment' component={RegHeadphone} key={'option_equipment'} />
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
