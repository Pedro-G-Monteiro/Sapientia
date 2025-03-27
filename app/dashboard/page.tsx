'use client';

import type { ArticleCardProps } from '@/components/ui/Cards/Articles/ArticleCard';
import ArticleList from '@/components/ui/Cards/Articles/ArticleList';
import type { CourseCardProps } from '@/components/ui/Cards/Courses/CourseCard';
import CourseList from '@/components/ui/Cards/Courses/CourseList';
import { DeadlineItemProps } from '@/components/ui/Deadlines/DeadlineItem';
import DeadlineList from '@/components/ui/Deadlines/DeadlineList';
import AppHeader from '@/components/ui/Layout/Header/AppHeader';
import AppSidebar from '@/components/ui/Layout/Sider/AppSidebar';
import StatsKPI from '@/components/ui/Stats/KPI/StatsKPI';
import { getArticles } from '@/services/articlesService';
import { getMockCourses } from '@/services/coursesService';
import { getUpcomingDeadlines } from '@/services/deadlinesService';
import {
	ClockCircleOutlined,
	FileDoneOutlined,
	FireOutlined,
	HourglassOutlined,
	RocketOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

const { Title, Text } = Typography;
const { Content } = Layout;

interface UserData {
	name: string;
	organization: string;
	avatar: string;
	progress: {
		completed: number;
		loginStreak: number;
		hoursLearned: number;
	};
}

const Dashboard: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [mobileView, setMobileView] = useState<boolean>(false);

	// Estados para os cursos
	const [enrolledCourses, setEnrolledCourses] = useState<CourseCardProps[]>([]);
	const [coursesLoading, setCoursesLoading] = useState(true);

	const [upcomingDeadlines, setUpcomingDeadlines] = useState<
		DeadlineItemProps[]
	>([]);
	const [deadlinesLoading, setDeadlinesLoading] = useState(true);

	const [trendingArticles, setTrendingArticles] = useState<ArticleCardProps[]>(
		[]
	);
	const [articlesLoading, setArticlesLoading] = useState(true);

	// Verifica se está em visualização mobile
	useEffect(() => {
		const handleResize = () => {
			setMobileView(window.innerWidth < 768);
			if (window.innerWidth < 768) {
				setCollapsed(true);
			}
		};

		handleResize(); // Verificação inicial
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Simula o carregamento de dados do usuário e cursos
	useEffect(() => {
		const timer = setTimeout(async () => {
			setUserData({
				name: 'Pedro Guedes',
				organization: 'Politécnico de Viseu',
				avatar: 'https://i.pravatar.cc/150?img=3',
				progress: {
					completed: 7,
					loginStreak: 3,
					hoursLearned: 42,
				},
			});

			// Simula obtenção de dados de cursos do mock service
			const mockCourses = getMockCourses();
			setEnrolledCourses(mockCourses.filter((course) => course.isEnrolled));

			try {
				const articles = await getArticles({ limit: 3, trending: true });
				setTrendingArticles(articles);
			} catch (error) {
				console.error('Error fetching trending articles:', error);
			}

			const mockDeadlines = getUpcomingDeadlines();
			setUpcomingDeadlines(mockDeadlines);
			setDeadlinesLoading(false);

			setArticlesLoading(false);
			setCoursesLoading(false);
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingContent}>
					<Spin size="large" />
					<Text className={styles.loadingText}>Getting things ready...</Text>
				</div>
			</div>
		);
	}

	return (
		<>
			<Layout className={styles.mainLayout}>
				{/* Sidebar usando o componente reutilizável */}
				<AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

				<Layout className={styles.contentLayout}>
					{/* Header usando o componente reutilizável */}
					<AppHeader
						collapsed={collapsed}
						setCollapsed={setCollapsed}
						userData={userData}
						mobileView={mobileView}
					/>

					<Content className={styles.siteContent}>
						{/* Hero section with user greeting */}
						<div className={styles.heroSection}>
							<div className={styles.heroContent}>
								<div className={styles.userWelcome}>
									<Avatar
										size={84}
										src={userData?.avatar}
										className={styles.userAvatar}
									/>
									<div className={styles.welcomeText}>
										<Title level={2}>Hello, {userData?.name}</Title>
										<Text className={styles.orgText}>
											{userData?.organization}
										</Text>
									</div>
								</div>

								<div className={styles.progressStats}>
									<StatsKPI
										label="Completed Courses"
										value={userData?.progress.completed ?? 0}
										icon={
											<FileDoneOutlined
												style={{
													fontSize: '24px',
													color: 'var(--primary-color-lighter)',
												}}
											/>
										}
									/>
									<StatsKPI
										label="Login Streak"
										value={userData?.progress.loginStreak ?? 0}
										icon={
											<FireOutlined
												style={{
													fontSize: '24px',
													color: 'var(--primary-color-lighter)',
												}}
											/>
										}
									/>
									<StatsKPI
										label="Hours Learned"
										value={userData?.progress.hoursLearned ?? 0}
										icon={
											<HourglassOutlined
												style={{
													fontSize: '24px',
													color: 'var(--primary-color-lighter)',
												}}
											/>
										}
									/>
								</div>
							</div>
						</div>

						{/* Main content area */}
						<div className={styles.dashboardContainer}>
							{/* Continue Learning Section - Usando o novo componente CourseList */}
							<section className={styles.continueSection}>
								<div className={styles.sectionHeader}>
									<div className={styles.sectionTitleGroup}>
										<RocketOutlined className={styles.sectionIcon} />
										<Title level={3}>Continue your journey</Title>
									</div>
									<Button
										type="text"
										className={styles.viewAllButton}
										onClick={() => (window.location.href = '/courses')}
									>
										See all
									</Button>
								</div>

								<CourseList
									courses={enrolledCourses}
									loading={coursesLoading}
									layout="horizontal"
									maxItemsBeforeScroll={4} // Força scroll horizontal após 4 itens
									emptyText="You haven't enrolled in any courses yet"
								/>
							</section>

							{/* Two-column layout for remaining sections */}
							<div className={styles.twoColumnLayout}>
								<div className={styles.mainColumn}>
									{/* Knowledge Center Section */}
									<section className={styles.knowledgeSection}>
										<div className={styles.sectionHeader}>
											<div className={styles.sectionTitleGroup}>
												<FireOutlined className={styles.sectionIcon} />
												<Title level={3}>Trending Articles</Title>
											</div>
											<Button
												type="text"
												className={styles.viewAllButton}
												onClick={() => (window.location.href = '/knowledge')}
											>
												Explore Knowledge Center
											</Button>
										</div>

										<ArticleList
											articles={trendingArticles}
											loading={articlesLoading}
											emptyText="No trending articles available"
										/>
									</section>
								</div>

								<div className={styles.sideColumn}>
									{/* Upcoming Deadlines */}
									<section className={styles.deadlinesSection}>
										<div className={styles.sectionHeader}>
											<div className={styles.sectionTitleGroup}>
												<ClockCircleOutlined className={styles.sectionIcon} />
												<Title level={4}>Upcoming Deadlines</Title>
											</div>
											<Button
												type="text"
												className={styles.viewAllButton}
												onClick={() => (window.location.href = '/tasks')}
											>
												See all
											</Button>
										</div>

										<DeadlineList
											deadlines={upcomingDeadlines}
											loading={deadlinesLoading}
											maxItems={3}
										/>
									</section>
								</div>
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default Dashboard;
