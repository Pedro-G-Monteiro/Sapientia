import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Empty, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CourseCard, { CourseCardProps } from './CourseCard';
import styles from './CourseList.module.css';

interface CourseListProps {
  courses: CourseCardProps[];
  loading?: boolean;
  layout?: 'grid' | 'horizontal';
  emptyText?: string;
  maxItemsBeforeScroll?: number; // Máximo de itens antes de forçar scroll
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  loading = false,
  layout = 'grid',
  emptyText = 'No courses available',
  maxItemsBeforeScroll = 5 // Por padrão, força scroll após 5 itens
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Verifica se precisamos mostrar os botões de scroll
  useEffect(() => {
    const checkScroll = () => {
      if (layout === 'horizontal' && scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
        
        // Mostra botões de scroll apenas se o conteúdo for mais largo que o contêiner
        setShowScrollButtons(scrollWidth > clientWidth);
        
        // Verifica se pode scrollar para a esquerda ou direita
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    // Verifica ao carregar e quando a janela for redimensionada
    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => window.removeEventListener('resize', checkScroll);
  }, [layout, courses]);

  // Atualiza estado de scroll quando o usuário rola horizontalmente
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 para evitar problemas de arredondamento
    }
  };

  // Funções para rolar o contêiner
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320, // Aproximadamente a largura de um card
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320, // Aproximadamente a largura de um card
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty description={emptyText} />
      </div>
    );
  }

  // Força o layout horizontal quando há muitos cursos
  const useHorizontalLayout = layout === 'horizontal' || (courses.length > maxItemsBeforeScroll);

  return (
    <div className={styles.courseListContainer}>
      {useHorizontalLayout && showScrollButtons && (
        <Button 
          className={`${styles.scrollButton} ${styles.scrollButtonLeft} ${!canScrollLeft ? styles.disabled : ''}`}
          icon={<LeftOutlined />} 
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        />
      )}
      
      <div 
        ref={scrollContainerRef}
        className={useHorizontalLayout ? styles.horizontalLayout : styles.gridLayout}
        onScroll={useHorizontalLayout ? handleScroll : undefined}
      >
        {courses.map((course) => (
          <div key={course.courseId} className={styles.courseCardContainer}>
            <CourseCard {...course} />
          </div>
        ))}
      </div>
      
      {useHorizontalLayout && showScrollButtons && (
        <Button 
          className={`${styles.scrollButton} ${styles.scrollButtonRight} ${!canScrollRight ? styles.disabled : ''}`}
          icon={<RightOutlined />} 
          onClick={scrollRight}
          disabled={!canScrollRight}
        />
      )}
    </div>
  );
};

export default CourseList;