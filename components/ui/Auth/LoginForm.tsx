'use client';

import { GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, message, Typography } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './LoginForm.module.css';

const { Text } = Typography;

interface LoginFormProps {
  onLoginSuccess: () => void;
  isLoading: boolean;
}

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isLoading }) => {
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Email format validation function
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // // Password strength checker
  // const checkPasswordStrength = (password: string) => {
  //   if (!password) return '';
    
  //   const hasLowerCase = /[a-z]/.test(password);
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasDigit = /\d/.test(password);
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  //   const isLongEnough = password.length >= 8;
    
  //   if (isLongEnough && hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar) {
  //     return 'strong';
  //   } else if (isLongEnough && ((hasLowerCase && hasUpperCase) || (hasDigit && hasSpecialChar))) {
  //     return 'medium';
  //   } else {
  //     return 'weak';
  //   }
  // };

  const handleSubmit = async (values: LoginFormValues) => {
    setFormLoading(true);
    try {
      // Simulate API call with progress feedback
      messageApi.loading('Authenticating...', 0);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes
      if (values.email === 'demo@example.com' && values.password === 'password') {
        messageApi.destroy();
        messageApi.success('Login successful!');
        onLoginSuccess();
      } else {
        messageApi.destroy();
        messageApi.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      messageApi.destroy();
      messageApi.error('An error occurred during login');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setFormLoading(true);
    
    messageApi.loading(`Connecting to ${provider}...`, 0);
    
    // Simulate API call for social login
    setTimeout(() => {
      messageApi.destroy();
      messageApi.success(`${provider} login successful!`);
      onLoginSuccess();
    }, 1000);
  };

  // No demo credentials needed

  return (
    <div className={styles.loginWrapper}>
      {contextHolder}
      
      <div className={styles.brandName}>Sapientia</div>
           
      <Form
        form={form}
        name="login_form"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        className={styles.loginForm}
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email' },
            { 
              validator: (_, value) => 
                !value || validateEmail(value) 
                  ? Promise.resolve() 
                  : Promise.reject(new Error('Please enter a valid email address'))
            }
          ]}
        >
          <Input 
            prefix={<MailOutlined className={styles.inputIcon} />}
            placeholder="your.email@example.com" 
            size="large"
            className={styles.formInput}
            autoComplete="email"
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Password"
          extra={
            <Link href="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          }
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="********" 
            size="large"
            className={styles.formInput}
            autoComplete="current-password"
            visibilityToggle={{ 
              visible: passwordVisible, 
              onVisibleChange: setPasswordVisible 
            }}
          />
        </Form.Item>
        
        <Form.Item className={styles.rememberMeContainer} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={formLoading || isLoading}
            className={styles.submitButton}
          >
            Sign in
          </Button>
        </Form.Item>
        
        <Divider plain className={styles.divider}>or</Divider>
        
        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={() => handleSocialLogin('Google')}
          loading={formLoading || isLoading}
          className={styles.googleButton}
        >
          Sign in with Google
        </Button>
      </Form>
      
      <div className={styles.signupSection}>
        <Text className={styles.signupText}>New to Sapientia?</Text>
        <Link href="/auth/signup" className={styles.signupLink}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;