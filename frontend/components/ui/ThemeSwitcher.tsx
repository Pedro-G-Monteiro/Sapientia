import { useTheme } from '@/contexts/ThemeContext';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import styles from './ThemeSwitcher.module.css';

interface ThemeSwitcherProps {
  className?: string;
  tooltip?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className = '', 
  tooltip = true 
}) => {
  const { mode, toggleTheme } = useTheme();
  
  const icon = mode === 'light' ? <BulbOutlined /> : <BulbFilled />;
  const tooltipTitle = mode === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro';
  
  const buttonContent = (
    <Button
      type="text"
      icon={icon}
      onClick={toggleTheme}
      className={`${styles.themeSwitcher} ${className}`}
      aria-label={tooltipTitle}
    />
  );
  
  if (tooltip) {
    return (
      <Tooltip title={tooltipTitle} placement="bottom">
        {buttonContent}
      </Tooltip>
    );
  }
  
  return buttonContent;
};

export default ThemeSwitcher;