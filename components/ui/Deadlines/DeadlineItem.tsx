'use client';

import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Badge, Progress, Tag, Typography } from 'antd';
import React from 'react';
import styles from './DeadlineItem.module.css';

const { Text, Title } = Typography;

export interface DeadlineItemProps {
  id: number;
  title: string;
  courseTitle?: string;
  dueDate: Date;
  completed?: boolean;
  progress?: number;
  priority?: 'high' | 'medium' | 'low';
  onClick?: (id: number) => void;
}

const DeadlineItem: React.FC<DeadlineItemProps> = ({
  id,
  title,
  courseTitle,
  dueDate,
  completed = false,
  progress = 0,
  priority = 'medium',
  onClick,
}) => {
  // Calcular dias restantes
  const today = new Date();
  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Formatar a data
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Determinar status e cor baseado nos dias restantes e progresso
  const getStatus = () => {
    if (completed) return 'completed';
    if (daysLeft < 0) return 'overdue';
    if (daysLeft === 0) return 'today';
    if (daysLeft <= 2) return 'urgent';
    return 'upcoming';
  };
  
  const getStatusColor = () => {
    const status = getStatus();
    switch (status) {
      case 'completed': return 'success';
      case 'overdue': return 'error';
      case 'today': return 'warning';
      case 'urgent': return 'warning';
      default: return 'processing';
    }
  };
  
  const getStatusText = () => {
    const status = getStatus();
    switch (status) {
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      case 'today': return 'Due Today';
      case 'urgent': return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
      default: return `${daysLeft} days left`;
    }
  };
  
  // Get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#faad14';
    }
  };
  
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  return (
    <div 
      className={styles.deadlineItem} 
      onClick={handleClick}
    >
      <div className={styles.deadlineContent}>
        <div className={styles.deadlineHeader}>
          <div className={styles.titleSection}>
            <Title level={5} className={styles.deadlineTitle} ellipsis={{ rows: 1 }}>
              {title}
            </Title>
            {courseTitle && (
              <Text className={styles.courseTitle} ellipsis>
                {courseTitle}
              </Text>
            )}
          </div>
          <Badge 
            status={getStatusColor() as any} 
            text={getStatusText()} 
            className={styles.deadlineStatus}
          />
        </div>
        
        <div className={styles.deadlineDetails}>
          <div className={styles.deadlineInfo}>
            <div className={styles.deadlineDate}>
              <CalendarOutlined /> <Text>{formatDate(dueDate)}</Text>
            </div>
            {!completed && (
              <Tag 
                color={getPriorityColor()}
                className={styles.priorityTag}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </Tag>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineItem;