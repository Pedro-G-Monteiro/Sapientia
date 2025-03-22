'use client';

import { GithubOutlined, GoogleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Divider, Form, Input, message, Space, Typography } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './LoginForm.module.css';

const { Title, Text, Paragraph } = Typography;

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

  const handleSubmit = async (values: LoginFormValues) => {
    setFormLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Login credentials:', values);
      
      if (values.email === 'demo@example.com' && values.password === 'password') {
        message.success('Login successful!');
        onLoginSuccess();
      } else {
        message.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setFormLoading(true);
    
    // Simulate API call for social login
    setTimeout(() => {
      message.success(`${provider} login successful!`);
      onLoginSuccess();
    }, 1000);
  };

  return (
    <Card className={styles.loginCard}>
      <div className={styles.cardHeader}>
        <Title level={2} className={styles.cardTitle}>Sign In</Title>
        <Paragraph className={styles.cardSubtitle}>
          Welcome back to Sapientia
        </Paragraph>
      </div>
      
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
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input 
            prefix={<MailOutlined className={styles.inputIcon} />} 
            placeholder="you@example.com" 
            size="large"
            className={styles.formInput}
            autoComplete="email"
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined className={styles.inputIcon} />} 
            placeholder="Enter your password" 
            size="large"
            className={styles.formInput}
            autoComplete="current-password"
          />
        </Form.Item>
        
        <div className={styles.formActions}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={formLoading || isLoading}
            className={styles.submitButton}
          >
            Sign In
          </Button>
        </Form.Item>
        
        <Divider className={styles.divider}>or continue with</Divider>
        
        <div className={styles.socialLogin}>
          <Space size="middle" className={styles.socialButtons}>
            <Button 
              icon={<GoogleOutlined />} 
              size="large"
              onClick={() => handleSocialLogin('Google')}
              loading={formLoading || isLoading}
              className={styles.googleButton}
            >
              Google
            </Button>
            <Button 
              icon={<GithubOutlined />} 
              size="large"
              onClick={() => handleSocialLogin('GitHub')}
              loading={formLoading || isLoading}
              className={styles.githubButton}
            >
              GitHub
            </Button>
          </Space>
        </div>
      </Form>
      
      <div className={styles.signupSection}>
        <Text className={styles.signupText}>Don't have an account?</Text>
        <Link href="/signup">
          <Button type="link" className={styles.signupLink}>Create an account</Button>
        </Link>
      </div>

      <div className={styles.demoCredentials}>
        <Text className={styles.demoTitle}>Demo Credentials:</Text>
        <Text className={styles.demoText}>Email: demo@example.com</Text>
        <Text className={styles.demoText}>Password: password</Text>
      </div>
    </Card>
  );
};

export default LoginForm;