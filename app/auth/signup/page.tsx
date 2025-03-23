'use client';

import { LockOutlined, MailOutlined, RocketOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../login/page.module.css';
import Image from 'next/image';

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const PerfectSignup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Signup form values:', values);
      // TODO: Replace with actual authentication API call
      
      message.success('Account created successfully! Please check your email to verify your account.');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      message.error('There was an error creating your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.contentContainer}>
        {/* Brand section */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <RocketOutlined className={styles.logoIcon} />
              <span className={styles.logoText}>Sapientia</span>
            </div>
          </Link>
          
          <div className={styles.brandContent}>
            <div className={styles.welcomeMessage}>
              <h1>Join Our Community</h1>
              <p>Create an account to access personalized learning resources and connect with other knowledge seekers.</p>
            </div>
            
            <div className={styles.imageContainer}>
              <Image
                width={500}
                height={500}
                src="/images/signup-illustration.svg" 
                alt="Community illustration" 
                className={styles.loginImage}
              />
            </div>
          </div>
        </div>
        
        {/* Form section */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              name="signup_form"
              initialValues={{ agreeTerms: false }}
              onFinish={handleSubmit}
              className={styles.loginForm}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Full name" 
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
              
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Email address" 
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Create a password" 
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm password" 
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
              
              <Form.Item
                name="agreeTerms"
                valuePropName="checked"
                rules={[
                  { 
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and privacy policy')),
                  },
                ]}
                className={styles.termsCheckbox}
              >
                <Checkbox>
                  I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
                </Checkbox>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className={styles.loginButton}
                  block
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
            
            <div className={styles.divider}>
              <span>Already have an account?</span>
            </div>
            
            <div className={styles.registerContainer}>
              <Link href="/login">
                <Button 
                  type="default" 
                  className={styles.registerButton}
                  block
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className={styles.footerLinks}>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            <span className={styles.dividerDot}>•</span>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <span className={styles.dividerDot}>•</span>
            <Link href="/" className={styles.footerLink}>Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectSignup;