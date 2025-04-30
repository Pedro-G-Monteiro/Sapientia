'use client';

import React, { useState } from 'react';
import { Button, message, Modal, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  buttonText?: string;
  showIcon?: boolean;
  buttonType?: 'primary' | 'default' | 'text' | 'link' | 'dashed';
  confirmLogout?: boolean;
  redirectTo?: string;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  buttonText = 'Logout',
  showIcon = true,
  buttonType = 'default',
  confirmLogout = false,
  redirectTo = '/login',
  className = '',
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const performLogout = async () => {
    try {
      setIsLoading(true);

      // Importar a função de logout dinamicamente
      const { logout } = await import('@/lib/auth-utils');
      await logout();

      messageApi.success('Logout successful!');
      router.push(redirectTo);
    } catch (error) {
      console.error('Error while logging out:', error);
      messageApi.error('Logout failed. Please try again.');
      
      // Em caso de falha, tentar forçar o logout
      try {
        const { forceLogout } = await import('@/lib/auth-utils');
        forceLogout();
      } catch (e) {
        console.error('Error forcing logout:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirmLogout) {
      Modal.confirm({
        title: 'Logout Confirmation',
        content: 'Are you sure you want to logout?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: performLogout,
      });
    } else {
      performLogout();
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type={buttonType}
        icon={showIcon ? <LogoutOutlined /> : undefined}
        onClick={handleLogout}
        loading={isLoading}
        className={className}
      >
        {buttonText}
      </Button>
    </>
  );
};

export default LogoutButton;