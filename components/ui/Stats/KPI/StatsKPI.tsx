import React, { ReactNode } from 'react';
import styles from './StatsKPI.module.css';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'top' | 'right';
}

const StatsKPI: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon,
  iconPosition = 'left' 
}) => {
  return (
    <div className={styles.statItem}>
      <div className={`${styles.statContent} ${styles[`icon${iconPosition.charAt(0).toUpperCase() + iconPosition.slice(1)}`]}`}>
        {icon && iconPosition === 'left' && <div className={styles.statIcon}>{icon}</div>}
        {icon && iconPosition === 'top' && <div className={styles.statIcon}>{icon}</div>}
        <div>
          <div className={styles.statValue}>{value}</div>
          <div className={styles.statLabel}>{label}</div>
        </div>
        {icon && iconPosition === 'right' && <div className={styles.statIcon}>{icon}</div>}
      </div>
    </div>
  );
};

export default StatsKPI;