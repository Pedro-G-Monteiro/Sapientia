'use client';

import {
  GoogleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  Progress,
  Tooltip,
  Typography,
} from 'antd';
import Link from 'next/link';
import type { ValidateErrorEntity } from 'rc-field-form/es/interface';
import React, { useEffect, useRef, useState } from 'react';
import styles from './SignUpForm.module.css';

const { Title, Text } = Typography;

interface SignUpFormProps {
	onSignUpSuccess: () => void;
	isLoading: boolean;
}

interface SignUpFormValues {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
	agreeTerms: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
	onSignUpSuccess,
	isLoading,
}) => {
	const [form] = Form.useForm();
	const [formLoading, setFormLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState<string>('');
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formStartRef = useRef<HTMLDivElement>(null);

	// Email format validation function
	const validateEmail = (email: string) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	// Password strength checker
	const checkPasswordStrength = (password: string) => {
		if (!password) {
			setPasswordStrength('');
			return '';
		}

		const hasLowerCase = /[a-z]/.test(password);
		const hasUpperCase = /[A-Z]/.test(password);
		const hasDigit = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const isLongEnough = password.length >= 8;

		let strength = '';
		if (
			isLongEnough &&
			hasLowerCase &&
			hasUpperCase &&
			hasDigit &&
			hasSpecialChar
		) {
			strength = 'strong';
		} else if (
			isLongEnough &&
			((hasLowerCase && hasUpperCase) || (hasDigit && hasSpecialChar))
		) {
			strength = 'medium';
		} else {
			strength = 'weak';
		}

		setPasswordStrength(strength);
		return strength;
	};

	// Get progress based on password strength
	const getPasswordProgress = () => {
		switch (passwordStrength) {
			case 'weak':
				return 33;
			case 'medium':
				return 66;
			case 'strong':
				return 100;
			default:
				return 0;
		}
	};

	// Get progress status and color based on password strength
	const getProgressStatus = () => {
		switch (passwordStrength) {
			case 'weak':
				return { status: 'exception' as const, color: '#e60b0b' };
			case 'medium':
				return { status: 'active' as const, color: '#d48806' };
			case 'strong':
				return { status: 'success' as const, color: '#389e0d' };
			default:
				return { status: 'normal' as const, color: '' };
		}
	};

  // Focus on first error when form errors occur
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = document.getElementById(Object.keys(formErrors)[0]);
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
  }, [formErrors]);

	const handleSubmit = async (values: SignUpFormValues) => {
		setFormLoading(true);
    console.log('Form values:', values);
    setFormErrors({});
    
		try {
			// Simulate API call with progress feedback
			messageApi.loading('Creating your account...', 0);

			await new Promise((resolve) => setTimeout(resolve, 1200));

			// For demo purposes
			messageApi.destroy();
			messageApi.success('Account created successfully!');
			onSignUpSuccess();
		} catch (error) {
			console.error('SignUp error:', error);
			messageApi.destroy();
			messageApi.error('An error occurred during sign up');
      setFormErrors({ form: 'An error occurred during sign up' });
		} finally {
			setFormLoading(false);
		}
	};

  const handleFormFinishFailed = ({ errorFields }: ValidateErrorEntity<SignUpFormValues>) => {
    const errors: Record<string, string> = {};
    
    errorFields.forEach((error) => {
      errors[error.name[0]] = error.errors[0];
    });
    
    setFormErrors(errors);
  };

	const handleSocialSignUp = (provider: string) => {
		setFormLoading(true);

		messageApi.loading(`Connecting to ${provider}...`, 0);

		// Simulate API call for social login
		setTimeout(() => {
			messageApi.destroy();
			messageApi.success(`${provider} account created successfully!`);
			onSignUpSuccess();
		}, 1000);
	};

	return (
		<div className={styles.signupWrapper} ref={formStartRef}>
			{contextHolder}
      
			<Form
				form={form}
				name="signup_form"
				layout="vertical"
				initialValues={{ agreeTerms: false }}
				onFinish={handleSubmit}
        onFinishFailed={handleFormFinishFailed}
				className={styles.signupForm}
        aria-labelledby="form-title"
        role="form"
			>
        <div id="signup-form-main" role="region" aria-labelledby="form-title" className={styles.formMain}>
          <div className={styles.formHeader}>
            <Title level={2} id="form-title" className={styles.formTitle}>Create Account</Title>
            <div className={styles.brandName} role="banner">Sapientia</div>
          </div>

          <Form.Item
            name="fullName"
            label={<label htmlFor="fullName">Full Name</label>}
            rules={[
              { required: true, message: 'Please enter your full name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined className={styles.inputIcon} aria-hidden="true" />}
              placeholder="Your full name"
              size="large"
              className={styles.formInput}
              autoComplete="name"
              id="fullName"
              aria-required="true"
              aria-invalid={formErrors.fullName ? "true" : "false"}
              aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
            />
            {formErrors.fullName && (
              <div id="fullName-error" className={styles.errorMessage} role="alert">
                {formErrors.fullName}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="email"
            label={<label htmlFor="email">Email Address</label>}
            rules={[
              { required: true, message: 'Please enter your email' },
              {
                validator: (_, value) =>
                  !value || validateEmail(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('Please enter a valid email address')
                      ),
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className={styles.inputIcon} aria-hidden="true" />}
              placeholder="your.email@example.com"
              size="large"
              className={styles.formInput}
              autoComplete="email"
              id="email"
              aria-required="true"
              aria-invalid={formErrors.email ? "true" : "false"}
              aria-describedby={formErrors.email ? "email-error" : undefined}
            />
            {formErrors.email && (
              <div id="email-error" className={styles.errorMessage} role="alert">
                {formErrors.email}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="password"
            label={<label htmlFor="password">Password</label>}
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <div>
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} aria-hidden="true" />}
                placeholder="Your password"
                size="large"
                className={styles.formInput}
                autoComplete="new-password"
                id="password"
                aria-required="true"
                aria-invalid={formErrors.password ? "true" : "false"}
                aria-describedby={`${formErrors.password ? "password-error " : ""}password-strength-info`}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                onChange={(e) => checkPasswordStrength(e.target.value)}
              />
              {formErrors.password && (
                <div id="password-error" className={styles.errorMessage} role="alert">
                  {formErrors.password}
                </div>
              )}
              {passwordStrength && (
                <div 
                  className={styles.passwordStrengthContainer} 
                  aria-live="polite" 
                  id="password-strength-info"
                >
                  <Progress
                    percent={getPasswordProgress()}
                    status={getProgressStatus().status}
                    strokeColor={getProgressStatus().color}
                    showInfo={false}
                    size="small"
                    aria-label={`Password strength is ${passwordStrength}`}
                  />
                  <div className={styles.passwordStrengthTextContainer}>
                    <Text className={styles.passwordStrengthText}>
                      Password strength:{' '}
                      <span
                        className={
                          styles[
                            `password${
                              passwordStrength.charAt(0).toUpperCase() +
                              passwordStrength.slice(1)
                            }`
                          ]
                        }
                      >
                        {passwordStrength.charAt(0).toUpperCase() +
                          passwordStrength.slice(1)}
                      </span>
                    </Text>
                    <Tooltip
                      title="Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters."
                      placement="right"
                    >
                      <InfoCircleOutlined 
                        className={styles.passwordInfoIcon} 
                        aria-label="Password requirements information"
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<label htmlFor="confirmPassword">Confirm Password</label>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} aria-hidden="true" />}
              placeholder="Confirm your password"
              size="large"
              className={styles.formInput}
              autoComplete="new-password"
              id="confirmPassword"
              aria-required="true"
              aria-invalid={formErrors.confirmPassword ? "true" : "false"}
              aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
              visibilityToggle={{
                visible: confirmPasswordVisible,
                onVisibleChange: setConfirmPasswordVisible,
              }}
            />
            {formErrors.confirmPassword && (
              <div id="confirmPassword-error" className={styles.errorMessage} role="alert">
                {formErrors.confirmPassword}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          'You must agree to the terms and privacy policy'
                        )
                      ),
              },
            ]}
          >
            <Checkbox 
              id="agreeTerms" 
              aria-required="true"
              aria-invalid={formErrors.agreeTerms ? "true" : "false"}
              aria-describedby={formErrors.agreeTerms ? "agreeTerms-error" : undefined}
            >
              <span>
                I agree to the{' '}
                <Link href="/terms" className={styles.termsLink}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className={styles.termsLink}>
                  Privacy Policy
                </Link>
              </span>
            </Checkbox>
            {formErrors.agreeTerms && (
              <div id="agreeTerms-error" className={styles.errorMessage} role="alert">
                {formErrors.agreeTerms}
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={formLoading || isLoading}
              className={styles.submitButton}
              aria-label="Create Account"
              aria-disabled={formLoading || isLoading ? "true" : "false"}
            >
              Create Account
            </Button>
          </Form.Item>

          <Divider plain className={styles.divider}>
            or
          </Divider>

          <Button
            icon={<GoogleOutlined aria-hidden="true" />}
            size="large"
            block
            onClick={() => handleSocialSignUp('Google')}
            loading={formLoading || isLoading}
            className={styles.googleButton}
            aria-label="Sign up with Google"
            aria-disabled={formLoading || isLoading ? "true" : "false"}
          >
            Sign up with Google
          </Button>
        </div>
			</Form>

			<div className={styles.loginSection}>
				<Text className={styles.loginText}>Already have an account?</Text>
				<Link href="/auth/login" className={styles.loginLink}>
					Sign in
				</Link>
			</div>
		</div>
	);
};

export default SignUpForm;