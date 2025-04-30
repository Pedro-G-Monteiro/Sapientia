"use client";

import {
  GoogleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
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
  Row,
  Col,
} from "antd";
import Link from "next/link";
import type { ValidateErrorEntity } from "rc-field-form/es/interface";
import React, { useEffect, useRef, useState } from "react";
import styles from "./SignUpForm.module.css";
import { apiFetch } from "@/lib/api";

const { Title, Text } = Typography;

interface SignUpFormProps {
  onSignUpSuccess: (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
  }) => void;
  isLoading: boolean;
}

interface SignUpFormValues {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface SignUpResponse {
  status: string;
  message: string;
  data: {
    user: {
      user_id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSignUpSuccess,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formStartRef = useRef<HTMLDivElement>(null);

  // Email format validation function
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Username validation function
  const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('');
      return '';
    }

    // Importamos a função no componente para evitar problemas de dependência circular
    // Em um cenário real, você poderia importar no topo do arquivo
    import('@/lib/auth-utils').then(({ validatePasswordStrength }) => {
      const result = validatePasswordStrength(password);
      setPasswordStrength(result.strength);
      
      // Opcionalmente, você pode definir uma mensagem de requisitos de senha aqui
      if (!result.valid) {
        // Você pode usar result.message para mostrar ao usuário os requisitos faltantes
      }
    });
    
    return passwordStrength;
  };

  // Get progress based on password strength
  const getPasswordProgress = () => {
    switch (passwordStrength) {
      case "weak":
        return 33;
      case "medium":
        return 66;
      case "strong":
        return 100;
      default:
        return 0;
    }
  };

  // Get progress status and color based on password strength
  const getProgressStatus = () => {
    switch (passwordStrength) {
      case "weak":
        return { status: "exception" as const, color: "#e60b0b" };
      case "medium":
        return { status: "active" as const, color: "#d48806" };
      case "strong":
        return { status: "success" as const, color: "#389e0d" };
      default:
        return { status: "normal" as const, color: "" };
    }
  };

  // Focus on first error when form errors occur
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = document.getElementById(
        Object.keys(formErrors)[0]
      );
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
  }, [formErrors]);

  const handleSubmit = async (values: SignUpFormValues) => {
    setFormLoading(true);
    setFormErrors({});

    try {
      // Call register endpoint
      const response = await apiFetch<SignUpResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: values.first_name,
          last_name: values.last_name,
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      messageApi.destroy();
      messageApi.success(response.message || 'Conta criada com sucesso!');
      
      // Pass user data to parent component for login process
      onSignUpSuccess({
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        email: values.email,
        password: values.password
      });
    } catch (error: any) {
      console.error('SignUp error:', error);
      messageApi.destroy();
      
      // Handle specific API errors
      if (error.status === 409) {
        // User already exists
        messageApi.error('Este email ou nome de usuário já está em uso');
        setFormErrors({ email: 'Este email ou nome de usuário já está em uso' });
      } else {
        // General error message
        const errorMsg = error.message || 'Falha ao criar conta.';
        messageApi.error(errorMsg);
        setFormErrors({ form: errorMsg });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormFinishFailed = ({
    errorFields,
  }: ValidateErrorEntity<SignUpFormValues>) => {
    const errors: Record<string, string> = {};

    errorFields.forEach((error) => {
      errors[error.name[0]] = error.errors[0];
    });

    setFormErrors(errors);
  };

  const handleSocialSignUp = (provider: string) => {
    setFormLoading(true);

    messageApi.loading(`Connecting to ${provider}...`, 0);

    setTimeout(() => {
      messageApi.destroy();
      messageApi.success(`${provider} account created successfully!`);
      onSignUpSuccess({
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        email: "",
        password: "",
      });
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
        <div
          id="signup-form-main"
          role="region"
          aria-labelledby="form-title"
          className={styles.formMain}
        >
          <div className={styles.formHeader}>
            <Title level={2} id="form-title" className={styles.formTitle}>
              Create Account
            </Title>
            <div className={styles.brandName} role="banner">
              Sapientia
            </div>
          </div>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="first_name"
                label={<label htmlFor="first_name">First Name</label>}
                rules={[
                  { required: true, message: "Please enter your first name" },
                  {
                    min: 2,
                    message: "First name must be at least 2 characters",
                  },
                ]}
              >
                <Input
                  prefix={
                    <UserOutlined
                      className={styles.inputIcon}
                      aria-hidden="true"
                    />
                  }
                  placeholder="First name"
                  size="large"
                  className={styles.formInput}
                  autoComplete="given-name"
                  id="first_name"
                  aria-required="true"
                  aria-invalid={formErrors.first_name ? "true" : "false"}
                  aria-describedby={
                    formErrors.first_name ? "first_name-error" : undefined
                  }
                />
                {formErrors.first_name && (
                  <div
                    id="first_name-error"
                    className={styles.errorMessage}
                    role="alert"
                  >
                    {formErrors.first_name}
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="last_name"
                label={<label htmlFor="last_name">Last Name</label>}
                rules={[
                  { required: true, message: "Please enter your last name" },
                  {
                    min: 2,
                    message: "Last name must be at least 2 characters",
                  },
                ]}
              >
                <Input
                  prefix={
                    <UserOutlined
                      className={styles.inputIcon}
                      aria-hidden="true"
                    />
                  }
                  placeholder="Last name"
                  size="large"
                  className={styles.formInput}
                  autoComplete="family-name"
                  id="last_name"
                  aria-required="true"
                  aria-invalid={formErrors.last_name ? "true" : "false"}
                  aria-describedby={
                    formErrors.last_name ? "last_name-error" : undefined
                  }
                />
                {formErrors.last_name && (
                  <div
                    id="last_name-error"
                    className={styles.errorMessage}
                    role="alert"
                  >
                    {formErrors.last_name}
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="username"
            label={<label htmlFor="username">Username</label>}
            rules={[
              { required: true, message: "Please enter a username" },
              { min: 3, message: "Username must be at least 3 characters" },
              {
                validator: (_, value) =>
                  !value || validateUsername(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Username must be 3-20 characters and can only contain letters, numbers, and underscores"
                        )
                      ),
              },
            ]}
          >
            <Input
              prefix={
                <UserAddOutlined
                  className={styles.inputIcon}
                  aria-hidden="true"
                />
              }
              placeholder="Choose a username"
              size="large"
              className={styles.formInput}
              autoComplete="username"
              id="username"
              aria-required="true"
              aria-invalid={formErrors.username ? "true" : "false"}
              aria-describedby={
                formErrors.username ? "username-error" : undefined
              }
            />
            {formErrors.username && (
              <div
                id="username-error"
                className={styles.errorMessage}
                role="alert"
              >
                {formErrors.username}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="email"
            label={<label htmlFor="email">Email Address</label>}
            rules={[
              { required: true, message: "Please enter your email" },
              {
                validator: (_, value) =>
                  !value || validateEmail(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Please enter a valid email address")
                      ),
              },
            ]}
          >
            <Input
              prefix={
                <MailOutlined className={styles.inputIcon} aria-hidden="true" />
              }
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
              <div
                id="email-error"
                className={styles.errorMessage}
                role="alert"
              >
                {formErrors.email}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="password"
            label={<label htmlFor="password">Password</label>}
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <div>
              <Input.Password
                prefix={
                  <LockOutlined
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />
                }
                placeholder="Your password"
                size="large"
                className={styles.formInput}
                autoComplete="new-password"
                id="password"
                aria-required="true"
                aria-invalid={formErrors.password ? "true" : "false"}
                aria-describedby={`${
                  formErrors.password ? "password-error " : ""
                }password-strength-info`}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                onChange={(e) => checkPasswordStrength(e.target.value)}
              />
              {formErrors.password && (
                <div
                  id="password-error"
                  className={styles.errorMessage}
                  role="alert"
                >
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
                      Password strength:{" "}
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
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined className={styles.inputIcon} aria-hidden="true" />
              }
              placeholder="Confirm your password"
              size="large"
              className={styles.formInput}
              autoComplete="new-password"
              id="confirmPassword"
              aria-required="true"
              aria-invalid={formErrors.confirmPassword ? "true" : "false"}
              aria-describedby={
                formErrors.confirmPassword ? "confirmPassword-error" : undefined
              }
              visibilityToggle={{
                visible: confirmPasswordVisible,
                onVisibleChange: setConfirmPasswordVisible,
              }}
            />
            {formErrors.confirmPassword && (
              <div
                id="confirmPassword-error"
                className={styles.errorMessage}
                role="alert"
              >
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
                          "You must agree to the terms and privacy policy"
                        )
                      ),
              },
            ]}
          >
            <Checkbox
              id="agreeTerms"
              aria-required="true"
              aria-invalid={formErrors.agreeTerms ? "true" : "false"}
              aria-describedby={
                formErrors.agreeTerms ? "agreeTerms-error" : undefined
              }
            >
              <span>
                I agree to the{" "}
                <Link href="/terms" className={styles.termsLink}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className={styles.termsLink}>
                  Privacy Policy
                </Link>
              </span>
            </Checkbox>
            {formErrors.agreeTerms && (
              <div
                id="agreeTerms-error"
                className={styles.errorMessage}
                role="alert"
              >
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
            onClick={() => handleSocialSignUp("Google")}
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
        <Link href="/login" className={styles.loginLink}>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
