'use client';

import { ClockCircleOutlined, EyeOutlined, FileTextOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Card, Tag, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import styles from './ArticleCard.module.css';

const { Text, Title } = Typography;

export interface ArticleCardProps {
  id: number;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category?: string;
  readTime?: number; // in minutes
  publishDate?: string;
  views?: number;
  likes?: number;
  author?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  thumbnailUrl,
  category,
  readTime,
  publishDate,
  views,
  likes,
  author,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/knowledge/articles/${id}`);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return '';
    
    const categoryColors: Record<string, string> = {
      'Technology': '#2db7f5',
      'Design': '#87d068',
      'Business': '#f50',
      'Development': '#108ee9',
      'Education': '#722ed1',
      'Health': '#13c2c2',
      'Science': '#eb2f96',
      'Others': '#faad14'
    };
    
    return categoryColors[category] || '#faad14';
  };

  return (
    <div className={styles.articleItem} onClick={handleCardClick}>
      <div 
        className={styles.articleThumbnail}
        style={{ 
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
          backgroundColor: !thumbnailUrl ? 'var(--primary-color-lighter)' : undefined
        }}
      >
        {!thumbnailUrl && <FileTextOutlined />}
      </div>
      
      <div className={styles.articleContent}>
        <div className={styles.articleHeader}>
          {category && (
            <Tag color={getCategoryColor(category)} className={styles.categoryTag}>
              {category}
            </Tag>
          )}
          
          {readTime && (
            <div className={styles.readTime}>
              <ClockCircleOutlined />
              <Text className={styles.readTimeText}>{readTime} min read</Text>
            </div>
          )}
        </div>
        
        <Title level={5} className={styles.articleTitle} ellipsis={{ rows: 2 }}>
          {title}
        </Title>
        
        {excerpt && (
          <Text type="secondary" className={styles.articleExcerpt} ellipsis>
            {excerpt}
          </Text>
        )}
        
        <div className={styles.articleFooter}>
          <div className={styles.authorInfo}>
            {author && (
              <>
                <Avatar 
                  size="small" 
                  src={author.avatarUrl} 
                  className={styles.authorAvatar}
                >
                  {!author.avatarUrl && author.name.charAt(0)}
                </Avatar>
                <Text className={styles.authorName}>{author.name}</Text>
              </>
            )}
            
            {publishDate && (
              <Tooltip title={new Date(publishDate).toLocaleDateString()}>
                <Text className={styles.publishDate}>{formatDate(publishDate)}</Text>
              </Tooltip>
            )}
          </div>
          
          <div className={styles.articleStats}>
            {views !== undefined && (
              <div className={styles.statItem}>
                <EyeOutlined />
                <Text className={styles.statText}>{views}</Text>
              </div>
            )}
            
            {likes !== undefined && (
              <div className={styles.statItem}>
                <LikeOutlined />
                <Text className={styles.statText}>{likes}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;