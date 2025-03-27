'use client';

import {
	BookOutlined,
	HomeOutlined,
	ReadOutlined,
	SettingOutlined,
	TeamOutlined,
	TrophyOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Logo from '../../Logo/Logo';
import styles from './AppSidebar.module.css';

const { Sider } = Layout;

interface AppSidebarProps {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, setCollapsed }) => {
	const router = useRouter();
	const pathname = usePathname();

	// Define os itens do menu
	const menuItems = [
		{
			key: '/dashboard',
			icon: <HomeOutlined />,
			label: 'Dashboard',
			onClick: () => router.push('/dashboard'),
		},
		{
			key: '/courses',
			icon: <BookOutlined />,
			label: 'My Courses',
			onClick: () => router.push('/my-courses'),
		},
		{
			key: '/knowledge',
			icon: <ReadOutlined />,
			label: 'Knowledge Center',
			onClick: () => router.push('/knowledge-center'),
		},
		{
			key: '/certificates',
			icon: <TrophyOutlined />,
			label: 'Certificates',
			onClick: () => router.push('/certificates'),
		},
		{
			key: '/organization',
			icon: <TeamOutlined />,
			label: 'My Organization',
			onClick: () => router.push('/my-organization'),
		},
		{
			key: '/settings',
			icon: <SettingOutlined />,
			label: 'Settings',
			onClick: () => router.push('/settings'),
		},
	];

	return (
		<Sider
			className={styles.sidebar}
			width={240}
			collapsible
			collapsed={collapsed}
			trigger={null}
			breakpoint="lg"
		>
			<div className={styles.headerContainer}>
				<div className={styles.logoContainer}>
					<Logo collapsed={collapsed} />
				</div>
			</div>

			<Menu
				mode="inline"
				selectedKeys={[pathname]}
				className={styles.sidebarMenu}
				items={menuItems}
			/>
		</Sider>
	);
};

export default AppSidebar;
