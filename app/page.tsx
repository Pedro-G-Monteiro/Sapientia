'use client'

import {
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HeartFilled,
  HeartOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Card, Progress, Space, Tag, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import React, { CSSProperties, useState } from 'react';

const { Text, Title, Paragraph } = Typography;

// Define types
export type ContentType = 'course' | 'post';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ImageLayout = 'top' | 'cover' | 'none';

export interface ContentCardProps {
  id: number | string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar?: string;
  publishDate: string;
  duration: number; // in minutes
  tags?: string[];
  difficulty?: DifficultyLevel;
  isFavorite?: boolean;
  isNew?: boolean;
  type?: ContentType;
  completionPercentage?: number;
  imageUrl?: string;
  imageLayout?: ImageLayout;
  onFavoriteToggle?: (id: number | string, isFavorite: boolean) => void;
}

// Custom styles to extend Ant Design
const styles = {
  card: {
    maxWidth: '400px',
    margin: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s',
  },
  cardHover: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.09)',
    transform: 'translateY(-4px)',
  },
  imageContainer: {
    position: 'relative' as const,
    overflow: 'hidden',
    height: '180px',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.5s ease',
  },
  imageHover: {
    transform: 'scale(1.05)',
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)',
  },
  coverTitle: {
    position: 'absolute' as const,
    bottom: '12px',
    left: '20px',
    right: '20px',
    color: 'white',
    zIndex: 1,
  },
  badgeContainer: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    border: 'none',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  favoriteButtonWithBadge: {
    right: '60px',
  },
  courseTypeTag: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  footerMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '12px',
  } as CSSProperties,
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  metaContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  } as CSSProperties,
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 0.45)',
  },
  progressContainer: {
    marginTop: '4px',
    marginBottom: '12px',
  },
  progressText: {
    textAlign: 'right',
    fontSize: '12px',
    marginTop: '4px',
  } as CSSProperties,
  cardContent: {
    padding: '16px 24px',
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
};

// Get difficulty color based on level
const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch(difficulty) {
    case "Beginner":
      return "success";
    case "Intermediate":
      return "warning";
    case "Advanced":
      return "error";
    default:
      return "success";
  }
};

const ContentCard: React.FC<ContentCardProps> = ({ 
  id,
  title,
  description,
  authorName,
  authorAvatar,
  publishDate,
  duration,
  tags = [],
  difficulty = "Beginner",
  isFavorite = false,
  isNew = false,
  type = "course",
  completionPercentage = 0,
  imageUrl = null,
  imageLayout = "top",
  onFavoriteToggle
}) => {
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Format date to a more readable format
  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Format duration (assuming it's in minutes)
  const formatDuration = (mins: number): string => {
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h${minutes ? ` ${minutes}m` : ''}`;
  };

  // Default image if none provided
  const displayImage = imageUrl || "/api/placeholder/400/180";
  
  // Handle favorite toggle
  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    if (onFavoriteToggle) {
      onFavoriteToggle(id, newFavoriteState);
    }
  };

  // Determine if we need to show the image
  const showImage = imageLayout !== 'none' && displayImage;
  
  // Define card actions based on content type
  const getTypeIcon = () => {
    return type === "course" ? 
      <BookOutlined /> : 
      <TrophyOutlined />;
  };
  
  const getTypeText = (): string => {
    return type === "course" ? "COURSE" : "ARTICLE";
  };

  // Render the card content
  const renderCardContent = () => (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Tag icon={getTypeIcon()} color={type === "course" ? "blue" : "purple"} style={styles.courseTypeTag}>
          {getTypeText()}
        </Tag>
        
        {/* Only show favorite button here if no image is displayed */}
        {!showImage && (
          <Tooltip title={favorite ? "Remove from favorites" : "Add to favorites"}>
            {favorite ? 
              <HeartFilled onClick={toggleFavorite} style={{color: '#ff4d4f', fontSize: '18px', cursor: 'pointer'}} /> :
              <HeartOutlined onClick={toggleFavorite} style={{fontSize: '18px', cursor: 'pointer'}} />
            }
          </Tooltip>
        )}
      </div>
      
      {/* Title - Only show if not displayed on the image */}
      {imageLayout !== 'cover' && (
        <Title level={4} ellipsis={{rows: 2}} style={{marginTop: '8px', marginBottom: '12px'}}>
          {title}
        </Title>
      )}
      
      {/* Description */}
      <Paragraph style={styles.ellipsis as React.CSSProperties}>
        {description}
      </Paragraph>
      
      {/* Tags */}
      <div style={{marginTop: '12px', marginBottom: '12px'}}>
        <Space wrap size={[0, 8]}>
          {tags.map((tag, index) => (
            <Tag key={index} color="default">{tag}</Tag>
          ))}
        </Space>
      </div>
      
      {/* Progress bar for courses */}
      {type === "course" && completionPercentage > 0 && (
        <div style={styles.progressContainer}>
          <Progress percent={completionPercentage} size="small" />
          <div style={styles.progressText}>{completionPercentage}% completed</div>
        </div>
      )}
      
      {/* Footer with metadata */}
      <div style={styles.footerMeta}>
        <div style={styles.authorInfo}>
          <Avatar 
            size="small" 
            src={authorAvatar} 
            icon={!authorAvatar && <UserOutlined />} 
            style={{marginRight: '8px'}} 
          />
          <Text type="secondary">{authorName}</Text>
        </div>
        
        <div style={styles.metaContainer}>
          <Tag color={getDifficultyColor(difficulty)}>
            {difficulty}
          </Tag>
          
          <Tooltip title="Duration">
            <span style={styles.metaItem}>
              <ClockCircleOutlined style={{marginRight: '4px'}} />
              <Text type="secondary">{formatDuration(duration)}</Text>
            </span>
          </Tooltip>
          
          <Tooltip title="Published date">
            <span style={styles.metaItem}>
              <CalendarOutlined style={{marginRight: '4px'}} />
              <Text type="secondary">{formattedDate}</Text>
            </span>
          </Tooltip>
        </div>
      </div>
    </>
  );

  return (
    <Card
      hoverable
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      bodyStyle={{padding: imageLayout === 'cover' ? 0 : 24}}
      cover={showImage ? 
        <div 
          style={styles.imageContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card image - Using Next.js Image component */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              alt={title}
              src={displayImage}
              fill
              sizes="400px"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.05)' : 'none'
              }}
            />
          </div>
          
          {/* Gradient overlay */}
          <div style={styles.imageOverlay}></div>
          
          {/* New badge */}
          {isNew && (
            <div style={styles.badgeContainer}>
              <Badge.Ribbon text="NEW" color="blue" />
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            style={{
              ...styles.favoriteButton,
              ...(isNew ? styles.favoriteButtonWithBadge : {})
            }}
          >
            {favorite ? 
              <HeartFilled style={{color: '#ff4d4f', fontSize: '18px'}} /> :
              <HeartOutlined style={{fontSize: '18px'}} />
            }
          </button>
          
          {/* Title on image for cover layout */}
          {imageLayout === 'cover' && (
            <Title level={4} style={styles.coverTitle}>
              {title}
            </Title>
          )}
        </div> : null
      }
    >
      {imageLayout === 'cover' ? (
        <div style={styles.cardContent}>
          {renderCardContent()}
        </div>
      ) : (
        renderCardContent()
      )}
    </Card>
  );
};

export default ContentCard;