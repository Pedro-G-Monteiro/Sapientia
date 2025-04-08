'use client';

import type { CourseCardProps } from '@/components/ui/Cards/Courses/CourseCard';
import CourseList from '@/components/ui/Cards/Courses/CourseList';
import AppHeader from '@/components/ui/Layout/Header/AppHeader';
import AppSidebar from '@/components/ui/Layout/Sider/AppSidebar';
import { getMockCourses } from '@/services/coursesService';
import {
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Empty,
  Input,
  Layout,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './courses.module.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface CoursesPageProps {}

const CoursesPage: React.FC<CoursesPageProps> = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [courses, setCourses] = useState<CourseCardProps[]>([]);
	const [enrolledCourses, setEnrolledCourses] = useState<CourseCardProps[]>([]);
	const [completedCourses, setCompletedCourses] = useState<CourseCardProps[]>(
		[]
	);
	const [favoriteCourses, setFavoriteCourses] = useState<CourseCardProps[]>([]);
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [mobileView, setMobileView] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [filterVisible, setFilterVisible] = useState<boolean>(false);
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [levelFilter, setLevelFilter] = useState<string>('all');
	const [sortBy, setSortBy] = useState<string>('newest');

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

	// Carrega os cursos
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				// Simula carregamento dos cursos
				const allCourses = getMockCourses();
				setCourses(allCourses);
				setEnrolledCourses(
					allCourses.filter(
						(course) => course.isEnrolled && !course.isCompleted
					)
				);
				setCompletedCourses(allCourses.filter((course) => course.isCompleted));
				setFavoriteCourses(allCourses.filter((course) => course.isFavorite));

				setLoading(false);
			} catch (error) {
				console.error('Error fetching courses:', error);
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	// Filtrar cursos
	const getFilteredCourses = (courseList: CourseCardProps[]) => {
		return courseList
			.filter((course) => {
				// Filtro de pesquisa por texto
				const matchesSearch = searchQuery
					? course.title.toLowerCase().includes(searchQuery.toLowerCase())
					: true;

				// Filtro por categoria
				const matchesCategory =
					categoryFilter === 'all' || course.level === categoryFilter;

				// Filtro por nível
				const matchesLevel =
					levelFilter === 'all' || course.level === levelFilter;

				return matchesSearch && matchesCategory && matchesLevel;
			})
			.sort((a, b) => {
				// Ordenação
				switch (sortBy) {
					case 'title-asc':
						return a.title.localeCompare(b.title);
					case 'title-desc':
						return b.title.localeCompare(a.title);
					case 'progress':
						return (b.progress || 0) - (a.progress || 0);
					default: // newest
						return b.courseId - a.courseId;
				}
			});
	};

	const filteredAllCourses = getFilteredCourses(courses);
	const filteredEnrolledCourses = getFilteredCourses(enrolledCourses);
	const filteredCompletedCourses = getFilteredCourses(completedCourses);
	const filteredFavoriteCourses = getFilteredCourses(favoriteCourses);

	const toggleFilterPanel = () => {
		setFilterVisible(!filterVisible);
	};

	return (
		<Layout className={styles.mainLayout}>
			{/* Sidebar usando o componente reutilizável */}
			<AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

			<Layout className={styles.contentLayout}>
				{/* Header usando o componente reutilizável */}
				<AppHeader
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					userData={{
						name: 'Pedro Guedes',
						avatar: 'https://i.pravatar.cc/150?img=3',
					}}
					mobileView={mobileView}
				/>

				<Content className={styles.siteContent}>
					<div className={styles.coursePageHeader}>
						<div className={styles.headerContent}>
							<div className={styles.headerTitles}>
								<Title level={2}>Courses</Title>
								<Text className={styles.subTitle}>
									Discover and learn with our learning platform
								</Text>
							</div>
						</div>
					</div>

					<div className={styles.coursePageContent}>
						{/* Seção de pesquisa e filtros */}
						<div className={styles.searchFilterSection}>
							<div className={styles.searchContainer}>
								<Input
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									prefix={<SearchOutlined />}
									allowClear
									className={styles.searchInput}
								/>
							</div>

							<div className={styles.filtersContainer}>
								<Space>
									<Button
										icon={<FilterOutlined />}
										onClick={toggleFilterPanel}
										type={filterVisible ? 'primary' : 'default'}
									>
										Filters
									</Button>

									<Select
										defaultValue="newest"
										onChange={(value) => setSortBy(value)}
										style={{ width: 140 }}
										suffixIcon={<SortAscendingOutlined />}
									>
										<Option value="newest">Newest</Option>
										<Option value="title-asc">Title (A-Z)</Option>
										<Option value="title-desc">Title (Z-A)</Option>
										<Option value="progress">Progress</Option>
									</Select>
								</Space>
							</div>
						</div>

						{/* Painel de filtros expansível */}
						{filterVisible && (
							<div className={styles.filterPanel}>
								<div className={styles.filterRow}>
									<div className={styles.filterItem}>
										<Text strong>Category</Text>
										<Select
											style={{ width: '100%' }}
											value={categoryFilter}
											onChange={(value) => setCategoryFilter(value)}
										>
											<Option value="all">All Categories</Option>
											<Option value="programming">Programming</Option>
											<Option value="design">Design</Option>
											<Option value="business">Business</Option>
											<Option value="marketing">Marketing</Option>
										</Select>
									</div>

									<div className={styles.filterItem}>
										<Text strong>Level</Text>
										<Select
											style={{ width: '100%' }}
											value={levelFilter}
											onChange={(value) => setLevelFilter(value)}
										>
											<Option value="all">All Levels</Option>
											<Option value="Beginner">Beginner</Option>
											<Option value="Intermediate">Intermediate</Option>
											<Option value="Advanced">Advanced</Option>
										</Select>
									</div>
								</div>

								<div className={styles.filterActions}>
									<Button
										onClick={() => {
											setCategoryFilter('all');
											setLevelFilter('all');
											setSearchQuery('');
										}}
									>
										Reset Filters
									</Button>
								</div>
							</div>
						)}

						<Divider />

						{/* Tabs para diferentes categorias de cursos */}
						<Tabs
							defaultActiveKey="all"
							className={styles.courseTabs}
							items={[
								{
									key: 'all',
									label: 'All Courses',
									children:
										filteredAllCourses.length > 0 ? (
											<CourseList
												courses={filteredAllCourses}
												loading={loading}
												layout="grid"
												emptyText="No courses match your filters"
                        forceGrid={true}
                      />
										) : (
											<Empty
												description={
													searchQuery ||
													categoryFilter !== 'all' ||
													levelFilter !== 'all'
														? 'No courses match your filters'
														: 'No courses available'
												}
											/>
										),
								},
								{
									key: 'enrolled',
									label: 'My Courses',
									children:
										filteredEnrolledCourses.length > 0 ? (
											<CourseList
												courses={filteredEnrolledCourses}
												loading={loading}
												layout="grid"
												emptyText="You haven't enrolled in any courses yet"
                        forceGrid={true}
                      />
										) : (
											<Empty
												description={
													searchQuery ||
													categoryFilter !== 'all' ||
													levelFilter !== 'all'
														? 'No courses match your filters'
														: "You haven't enrolled in any courses yet"
												}
											/>
										),
								},
								{
									key: 'completed',
									label: 'Completed',
									children:
										filteredCompletedCourses.length > 0 ? (
											<CourseList
												courses={filteredCompletedCourses}
												loading={loading}
												layout="grid"
												emptyText="You haven't completed any courses yet"
                        forceGrid={true}
                      />
										) : (
											<Empty
												description={
													searchQuery ||
													categoryFilter !== 'all' ||
													levelFilter !== 'all'
														? 'No courses match your filters'
														: "You haven't completed any courses yet"
												}
											/>
										),
								},
								{
									key: 'favorites',
									label: 'Favorites',
									children:
										filteredFavoriteCourses.length > 0 ? (
											<CourseList
												courses={filteredFavoriteCourses}
												loading={loading}
												layout="grid"
												emptyText="You don't have any favorite courses yet"
                        forceGrid={true}
                      />
										) : (
											<Empty
												description={
													searchQuery ||
													categoryFilter !== 'all' ||
													levelFilter !== 'all'
														? 'No courses match your filters'
														: "You don't have any favorite courses yet"
												}
											/>
										),
								},
							]}
						/>
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default CoursesPage;
