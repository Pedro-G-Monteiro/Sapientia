'use client';

import {
	BookOutlined,
	HomeOutlined,
	ReadOutlined,
	SettingOutlined,
	TeamOutlined,
	TrophyOutlined,
} from '@ant-design/icons';
import { Drawer, Layout, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Logo from '../../Logo/Logo';
import styles from './AppSidebar.module.css';

const { Sider } = Layout;

interface AppSidebarProps {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	mobileView?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, setCollapsed, mobileView = false }) => {
	const router = useRouter();
	const pathname = usePathname();

	// Define os itens do menu
	const menuItems = [
		{
			key: '/dashboard',
			icon: <HomeOutlined />,
			label: 'Dashboard',
			onClick: () => {
				router.push('/dashboard');
				if (mobileView) setCollapsed(true);
			},
		},
		{
			key: '/courses',
			icon: <BookOutlined />,
			label: 'Courses',
			onClick: () => {
				router.push('/courses');
				if (mobileView) setCollapsed(true);
			},
		},
		{
			key: '/knowledge',
			icon: <ReadOutlined />,
			label: 'Knowledge Center',
			onClick: () => {
				router.push('/knowledge-center');
				if (mobileView) setCollapsed(true);
			},
		},
		{
			key: '/certificates',
			icon: <TrophyOutlined />,
			label: 'Certificates',
			onClick: () => {
				router.push('/certificates');
				if (mobileView) setCollapsed(true);
			},
		},
		{
			key: '/organization',
			icon: <TeamOutlined />,
			label: 'My Organization',
			onClick: () => {
				router.push('/my-organization');
				if (mobileView) setCollapsed(true);
			},
		},
		{
			key: '/settings',
			icon: <SettingOutlined />,
			label: 'Settings',
			onClick: () => {
				router.push('/settings');
				if (mobileView) setCollapsed(true);
			},
		},
	];

	const sidebarContent = (
		<>
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
		</>
	);

	// Em dispositivos móveis, usamos o Drawer em vez do Sider fixo
	if (mobileView) {
		return (
			<Drawer
				placement="left"
				onClose={() => setCollapsed(true)}
				open={!collapsed}
				closable={false}
				width={240}
				styles={{ body: {padding: 0, height: '100%', overflow: 'auto' }}}
				className={styles.mobileSidebar}
			>
				{sidebarContent}
			</Drawer>
		);
	}

	// Em telas desktop, usamos o Sider normal
	return (
		<Sider
			className={styles.sidebar}
			width={240}
			collapsible
			collapsed={collapsed}
			trigger={null}
			breakpoint="lg"
		>
			{sidebarContent}
		</Sider>
	);
};

export default AppSidebar;