'use client';

import { Empty, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import DeadlineItem, { DeadlineItemProps } from './DeadlineItem';
import styles from './DeadlineList.module.css';

interface DeadlineListProps {
  deadlines: DeadlineItemProps[];
  loading?: boolean;
  emptyText?: string;
  maxItems?: number;
}

const DeadlineList: React.FC<DeadlineListProps> = ({
  deadlines,
  loading = false,
  emptyText = 'No upcoming deadlines',
  maxItems = 3,
}) => {
  const router = useRouter();
  
  const handleDeadlineClick = (id: number) => {
    router.push(`/tasks/${id}`);
  };
  
  // Filtrar os prazos por data e limitar pelo número máximo
  const sortedDeadlines = [...deadlines]
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, maxItems);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="default" />
      </div>
    );
  }
  
  if (!deadlines || deadlines.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty
          description={emptyText}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }
  
  return (
    <div className={styles.deadlineList}>
      {sortedDeadlines.map(deadline => (
        <DeadlineItem 
          key={deadline.id}
          {...deadline}
          onClick={handleDeadlineClick}
        />
      ))}
    </div>
  );
};

export default DeadlineList;