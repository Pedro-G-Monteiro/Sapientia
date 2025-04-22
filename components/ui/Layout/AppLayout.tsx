'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import AppHeader from '@/components/ui/Layout/Header/AppHeader';
import AppSidebar from '@/components/ui/Layout/Sider/AppSidebar';
import styles from './AppLayout.module.css';

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(true);

	const userData = {
		name: 'Pedro Guedes',
		avatar: 'https://i.pravatar.cc/150?img=3',
	};

	return (
		<Layout className={styles.mainLayout}>
			<AppSidebar 
				collapsed={collapsed} 
				setCollapsed={setCollapsed}
				mobileView={true} 
			/>

			<Layout 
				className={`${styles.contentLayout} ${collapsed ? styles.contentCollapsed : ''}`}
			>
				<AppHeader
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					userData={userData}
				/>

				<Content className={styles.siteContent}>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
}