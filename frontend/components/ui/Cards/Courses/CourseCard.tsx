'use client';

import {
	BookOutlined,
	ClockCircleOutlined,
	HeartFilled,
	TrophyFilled,
	TrophyOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Progress, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './CourseCard.module.css';

const { Title, Text } = Typography;

export interface CourseCardProps {
	courseId: number;
	title: string;
	description?: string;
	thumbnailUrl?: string;
	level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
	durationHours?: number;
	progress?: number;
	isEnrolled?: boolean;
	isCompleted?: boolean;
	isFree?: boolean;
	isPublished?: boolean;
	isFavorite?: boolean;
	createdBy?: {
		userId: number;
		firstName: string;
		lastName: string;
	};
	organization?: {
		name: string;
		logoUrl?: string;
	};
	isPreview?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
	courseId,
	title,
	description,
	thumbnailUrl,
	level,
	durationHours,
	isFavorite,
	progress = 0,
	isEnrolled = false,
	isCompleted = false,
	organization,
	isPreview = false,
}) => {
	const router = useRouter();

	const [favorite, setFavorite] = useState(isFavorite ?? false);
	const [isMobile, setIsMobile] = useState(false);
	const [isTablet, setIsTablet] = useState(false);

	// Detector de tamanho de tela
	useEffect(() => {
		const checkScreenSize = () => {
			const width = window.innerWidth;
			setIsMobile(width <= 480);
			setIsTablet(width > 480 && width <= 768);
		};
		
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		
		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	}, []);

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent card click navigation
		setFavorite((prev) => !prev);

		// TODO: You can also make a backend API call here to persist the favorite state
		// Example: await toggleFavoriteCourse(courseId, !favorite);
	};

	const handleCardClick = () => {
		router.push(`/courses/${courseId}`);
	};

	// Background gradient colors based on level
	const getBgColor = () => {
		switch (level) {
			case 'Beginner':
				return 'linear-gradient(135deg, #3a9c74 0%, #43b692 100%)';
			case 'Intermediate':
				return 'linear-gradient(135deg, #3e73cc 0%, #5e92e6 100%)';
			case 'Advanced':
				return 'linear-gradient(135deg, #9c3a6e 0%, #b64388 100%)';
			default:
				return 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-light) 100%)';
		}
	};

	// Format level text for display
	const getLevelText = () => {
		return level || 'All Levels';
	};

	// Format duration for display
	const formatDuration = () => {
		if (!durationHours) return 'Self-paced';
		if (durationHours < 1) return `${Math.round(durationHours * 60)} min`;
		return durationHours === 1 ? '1 hour' : `${durationHours} hours`;
	};

	// Determinar a classe CSS para aplicar à descrição com base no tamanho da tela
	const getDescriptionClass = () => {
		if (isMobile) return styles.descriptionOneLine;
		if (isTablet) return styles.descriptionTwoLines;
		return styles.descriptionThreeLines;
	};

	// Truncar a descrição de forma dinâmica
	const getDescriptionText = () => {
		if (!description) return "";
		
		if (isMobile && description.length > 50) {
			return `${description.slice(0, 50)}...`;
		} else if (isTablet && description.length > 80) {
			return `${description.slice(0, 80)}...`;
		} else if (description.length > 120) {
			return `${description.slice(0, 120)}...`;
		}
		
		return description;
	};

	return (
		<Card
			className={styles.courseCard}
			onClick={ isPreview ? undefined : handleCardClick}
			styles={{ body: { padding: 0, height: '100%' } }}
			hoverable={!isPreview}
		>
			<div className={styles.courseCardHeader}>
				{thumbnailUrl ? (
					<div
						className={styles.courseThumbnail}
						style={{ backgroundImage: `url(${thumbnailUrl})` }}
					/>
				) : (
					<div className={styles.courseThumbnailPlaceholder}>
						<BookOutlined />
					</div>
				)}

				<div className={styles.courseFavoriteLabel}>
				{isCompleted && (
					<Tooltip title={favorite ? 'Remove from favorites' : 'Add to favorites'}>
						<Button className={styles.favoriteTag} onClick={handleFavoriteClick}>
							{favorite ? (
								<HeartFilled style={{ color: 'var(--primary-color)' }} />
							) : (
								<HeartFilled style={{ color: 'lightgray' }} />
							)}
						</Button>
					</Tooltip>
				)}
				</div>
			</div>

			<div className={styles.courseCardContent}>
				<Title level={5} className={styles.courseTitle} ellipsis={{ rows: 2 }}>
					{title}
				</Title>

				{description && (
					<div className={styles.courseDescription}>
						<Tooltip title={description}>
							<Text 
								type="secondary" 
								className={getDescriptionClass()}
							>
								{getDescriptionText()}
								{description.length > (isMobile ? 50 : isTablet ? 80 : 120) && (
									<span className={styles.seeMore}> See more</span>
								)}
							</Text>
						</Tooltip>
					</div>
				)}

				<div
					className={styles.courseMetadata}
					style={{ backgroundColor: getBgColor() }}
				>
					<Tooltip title={`Level: ${getLevelText()}`}>
						<div className={styles.metaItem}>
							<TrophyOutlined />
							<Text className={styles.metaText}>{getLevelText()}</Text>
						</div>
					</Tooltip>

					<Tooltip title={`Duration: ${formatDuration()}`}>
						<div className={styles.metaItem}>
							<ClockCircleOutlined />
							<Text className={styles.metaText}>{formatDuration()}</Text>
						</div>
					</Tooltip>

					{organization && (
						<Tooltip title={`Organization: ${organization.name}`}>
							<div className={styles.metaItem}>
								<UserOutlined />
								<Text className={styles.metaText}>{organization.name}</Text>
							</div>
						</Tooltip>
					)}
				</div>
			</div>

			{isEnrolled && (
				<div className={styles.courseProgress}>
					{!isCompleted ? (
						<>
							<Progress
								percent={progress}
								size="small"
								status="active"
								strokeColor={{
									'0%': 'var(--primary-color)',
									'100%': 'var(--primary-color-light)',
								}}
							/>
						</>
					) : (
						<div className={styles.completedBadge}>
							<TrophyFilled /> Completed
						</div>
					)}
				</div>
			)}
		</Card>
	);
};

export default CourseCard;