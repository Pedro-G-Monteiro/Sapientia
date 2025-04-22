import React, { ReactNode, useEffect, useState } from 'react';
import styles from './StatsKPI.module.css';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'top' | 'right';
  suffix?: string; // Adição para permitir sufixos como "dias", "horas", etc.
}

const StatsKPI: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon,
  iconPosition = 'left',
  suffix
}) => {
  const [currentIconPosition, setCurrentIconPosition] = useState(iconPosition);
  const [isMobile, setIsMobile] = useState(false);
  
  // Em telas pequenas, forçar ícone para a esquerda para economizar espaço
  // e detectar se estamos em mobile para outros ajustes visuais
  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 480;
      setIsMobile(smallScreen);
      
      if (smallScreen) {
        setCurrentIconPosition('left');
      } else {
        setCurrentIconPosition(iconPosition);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [iconPosition]);

  return (
    <div className={styles.statItem}>
      <div className={`${styles.statContent} ${styles[`icon${currentIconPosition.charAt(0).toUpperCase() + currentIconPosition.slice(1)}`]}`}>
        {icon && (currentIconPosition === 'left' || currentIconPosition === 'top') && 
          <div className={styles.statIcon}>{icon}</div>
        }
        <div>
          <div className={styles.statValue}>
            {value}
            {suffix && <span style={{ fontSize: isMobile ? '0.9rem' : '1.2rem', marginLeft: '4px', fontWeight: '400' }}>{suffix}</span>}
          </div>
          <div className={styles.statLabel}>{label}</div>
        </div>
        {icon && currentIconPosition === 'right' && 
          <div className={styles.statIcon}>{icon}</div>
        }
      </div>
    </div>
  );
};

export default StatsKPI;