import React from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { DesktopOutlined, HomeOutlined } from '@ant-design/icons';
import { getMenuApi } from '../../api'

const { SubMenu } = Menu
class MenuComponent extends React.PureComponent {
    state = {
        menuTreeNode: [],

    }

    getMenu = async () => {
        this.menuList = await getMenuApi()

        const menuTreeNode = this.generateMenu(this.menuList ?? []);

        this.setState({
            menuTreeNode
        })
    }

    componentDidMount() {
        this.getMenu();
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

    //设置菜单展开
    setMenuOpen = () => {
        const { pathname } = this.props.location;
        //const pattern = /^(\/.*\/.*\/).*$/ ;
        // const pattern = /^(\/.*?)\/.*$/;
        // if (pattern.test(pathname)) {
        //     this.openKeys = RegExp.$1
        // }
        //console.log(pathname, pathname.split('/').splice(1))
        const pathList = pathname.split('/')
        const pathArray = pathList.splice(1, pathList.length - 2)

        return pathArray.reduce((total, curr, next) => {
            total[next] = `${total}/${curr}`
            return total
        }, []);
    }

    render() {
        return (
            <Menu theme='dark'
                mode="inline"
                defaultOpenKeys={this.setMenuOpen()}
                selectedKeys={[this.props.location.pathname]}
                style={{ height: '90%' }}
            >
                {this.state.menuTreeNode}
            </Menu>

        )
    }
}

export default withRouter(MenuComponent);