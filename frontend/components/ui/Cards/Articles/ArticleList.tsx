'use client';

import { Empty, Spin } from 'antd';
import React from 'react';
import ArticleCard, { ArticleCardProps } from './ArticleCard';
import styles from './ArticleList.module.css';

interface ArticleListProps {
  articles: ArticleCardProps[];
  loading?: boolean;
  emptyText?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  loading = false,
  emptyText = 'No articles available',
}) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div className={styles.articleList}>
      {articles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
};

export default ArticleList;