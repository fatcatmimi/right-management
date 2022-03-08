import React from 'react'
import { Link, withRouter } from 'react-router-dom';
// import {menuList} from '../../config/menu_config.js'
import { Menu } from 'antd';
import { DesktopOutlined, HomeOutlined } from '@ant-design/icons';
import { getMenuApi } from '../../api'

const { SubMenu } = Menu
class MenuComponent extends React.PureComponent {
    state = {
        menuTreeNode: [],
    }

    getMenu = async () => {
        const menuList = await getMenuApi()

        const menuTreeNode = this.generateMenu(menuList ?? []);

        this.setState({
            menuTreeNode
        })
    }

    componentDidMount() {
        this.getMenu()
        // setTimeout(()=>{
        //     this.getMenu()
        // },5000)

    }

    generateMenu = (menuList) => {
        return menuList.map((value) => {
            if (value.children) {
                return (
                    <SubMenu key={value.key} title={value.title} icon={<DesktopOutlined />}>
                        {this.generateMenu(value.children)}
                    </SubMenu>
                )
            } else {
                return <Menu.Item key={value.key} icon={value.title === '首页' ? <HomeOutlined /> : null}>
                    <Link to={{
                        pathname: value.key,
                        state: {
                            projectId: value.projectId
                        }
                    }}>
                        {/*<Link to={value.key}>*/}
                        {value.title}
                    </Link>
                </Menu.Item>
            }
        })
    }

    render() {
        const { pathname } = this.props.location;
        //const pattern = /^(\/.*\/.*\/).*$/ ;
        const pattern = /^(\/.*?)\/.*$/;
        if (pattern.test(pathname)) {
            this.openKeys = RegExp.$1
        }

        return (
            <Menu theme='dark'
                mode="inline"
                defaultOpenKeys={[this.openKeys]}
                selectedKeys={[pathname]}
                style={{ height: '90%' }}
            >
                {this.state.menuTreeNode}
            </Menu>

        )
    }
}

export default withRouter(MenuComponent);