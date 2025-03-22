'use client';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Auth.module.css';

const { Title, Text } = Typography;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface SignupProps {
  onSuccess?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Signup form values:', values);
      // TODO: Replace with actual registration API call
      
      message.success('Account created successfully! Please check your email to verify your account.');
      
      // Handle successful signup
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      message.error('There was an error creating your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.authSection} id="signup">
      <div className={styles.container}>
        <div className={styles.authWrapper}>
          <div className={styles.authContent}>
            <div className={styles.authFormWrapper}>
              <div className={styles.formHeader}>
                <Title level={2} className={styles.formTitle}>Create Account</Title>
                <Text className={styles.formSubtitle}>Join our community and start learning</Text>
              </div>
              
              <Form
                form={form}
                name="signup"
                layout="vertical"
                initialValues={{ agreeTerms: false }}
                onFinish={handleSubmit}
                className={styles.authForm}
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input 
                    prefix={<UserOutlined className={styles.inputIcon} />} 
                    placeholder="Full name" 
                    size="large" 
                    className={styles.formInput}
                  />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className={styles.inputIcon} />} 
                    placeholder="Email address" 
                    size="large" 
                    className={styles.formInput}
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
                    prefix={<LockOutlined className={styles.inputIcon} />} 
                    placeholder="Create a password" 
                    size="large" 
                    className={styles.formInput}
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
                    prefix={<LockOutlined className={styles.inputIcon} />} 
                    placeholder="Confirm password" 
                    size="large" 
                    className={styles.formInput}
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
                    className={styles.authButton}
                    block
                  >
                    Create Account
                  </Button>
                </Form.Item>
                
                <div className={styles.alternative}>
                  <div className={styles.alternativeLine}>
                    <span>Already have an account?</span>
                  </div>
                  
                  <Link href="/login">
                    <Button type="default" className={styles.alternateButton} block>
                      Log In
                    </Button>
                  </Link>
                </div>
              </Form>
            </div>
          </div>
          
          <div className={styles.authImageWrapper}>
            <div className={styles.authImage}>
              <div className={styles.imageShadow}></div>
              <img 
                src="/images/signup-image.jpg" 
                alt="Join our knowledge community" 
                className={styles.actualImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;