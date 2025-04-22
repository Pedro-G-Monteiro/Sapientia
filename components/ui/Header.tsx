import {
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Layout } from 'antd';
import { MenuDividerType } from 'antd/es/menu/interface';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.css';
import ThemeSwitcher from './ThemeSwitcher';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  title?: string;
  logoUrl?: string;
  onMenuClick?: () => void;
  isAuthenticated?: boolean;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Educational Platform',
  logoUrl,
  onMenuClick,
  isAuthenticated = false,
  username = 'User',
}) => {
  // Menu do usuário para quando estiver autenticado
  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'My Profile',
        icon: <UserOutlined />,
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined />,
      },
      {
        type: 'divider' as const,
      } as MenuDividerType,
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  };

  // Função para lidar com cliques nos itens do menu do usuário
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        // Navegar para o perfil
        break;
      case 'settings':
        // Navegar para configurações
        break;
      case 'logout':
        // Implementar lógica de logout
        break;
      default:
        break;
    }
  };

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          {onMenuClick && (
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={onMenuClick}
              className={styles.menuButton}
            />
          )}
          
          <div className={styles.logo}>
            {logoUrl ? (
              <Image src={logoUrl} alt={title} className={styles.logoImage} />
            ) : (
              <span className={styles.logoText}>{title}</span>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <ThemeSwitcher />
          
          {isAuthenticated ? (
            <Dropdown 
              menu={{ items: userMenu.items, onClick: handleMenuClick }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <div className={styles.userInfo}>
                <span className={styles.username}>{username}</span>
                <Button 
                  type="text" 
                  icon={<UserOutlined />} 
                  className={styles.avatarButton}
                />
              </div>
            </Dropdown>
          ) : (
            <div className={styles.authButtons}>
              <Button type="link" className={styles.loginButton}>
                <Link href="/login">Login</Link>
              </Button>
              <Button type="primary">
                <Link href="/signup">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;