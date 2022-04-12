import React, {useState} from 'react';
import {Button, Menu} from "antd";
import {MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import styles from "./Admin.module.sass"
import Link from "next/link"
import {useRouter} from "next/router";
import {AllScreenLayout} from "../Layouts/AllScreenLayout";

const {SubMenu} = Menu;

export const AdminLayout: React.FC = ({children}) => {
    const router = useRouter()
    const {slug} = router.query
    const [menuCollapsed, setMenuCollapsed] = useState(false)
    const toggleCollapsed = () => {
        setMenuCollapsed(prevState => !prevState);
    };
    return (
        <AllScreenLayout isAuthRequired={true} isAdmin={true}>
            <div className={styles.admin__wrapper}>
                <div className={styles.admin__menu}>
                    <div className={styles.admin__menu__header}>
                        <Button type="primary" onClick={toggleCollapsed} style={{marginBottom: 16}}>
                            {React.createElement(menuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                        </Button>
                    </div>

                    <Menu
                        onClick={() => {}}
                        style={{width: menuCollapsed ? 76 : 256}}
                        defaultSelectedKeys={[slug as string]}
                        defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                        className={menuCollapsed ? styles.antMenuInlineCollapsed : ""}
                        mode="inline"
                        inlineCollapsed={menuCollapsed}
                    >
                        <SubMenu key="sub1" icon={<MailOutlined/>} title="Пользователи">
                            <Menu.Item key="players"><Link href={"/admin/players"}><a>Список</a></Link></Menu.Item>
                            <Menu.Item key="players-create"><Link href={"/admin/players-create"}><a>Создать</a></Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<MailOutlined/>} title="Команды">
                            <Menu.Item key="teams"><Link href={"/admin/teams"}><a>Список</a></Link></Menu.Item>
                            <Menu.Item key="teams-create"><Link href={"/admin/teams-create"}><a>Создать</a></Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<MailOutlined/>} title="Турниры">
                            <Menu.Item key="tournaments"><Link href={"/admin/tournaments"}><a>Список</a></Link></Menu.Item>
                            <Menu.Item key="tournaments-create"><Link href={"/admin/tournaments-create"}><a>Создать</a></Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className={styles.admin__content}>
                    {children}
                </div>
            </div>
        </AllScreenLayout>
    );
};
