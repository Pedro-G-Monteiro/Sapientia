"use client";

import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { setAuthCookie } from "@/lib/auth-utils";
import { apiFetch } from "@/lib/api";

const { Text } = Typography;

interface LoginFormProps {
  onLoginSuccess: () => void;
  isLoading: boolean;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isLoading }) => {
  const [form] = Form.useForm<LoginFormValues>();
  const [formLoading, setFormLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (values: LoginFormValues) => {
    setFormLoading(true);
    try {
      // Call login endpoint and unwrap data
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      console.log("Login response:", response);
      messageApi.destroy();
      messageApi.success(response.message || "Login successful!");

      // Store JWT in cookie for subsequent requests (more secure than localStorage)
      // @ts-expect-error
      setAuthCookie(response.data.token);

      // Call onLoginSuccess to redirect to dashboard
      onLoginSuccess();
    } catch (err: any) {
      console.error("Login error:", err);
      messageApi.destroy();
      messageApi.error(err.message || "Invalid email or password");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setFormLoading(true);
    messageApi.loading(`Connecting to ${provider}...`, 0);
    setTimeout(() => {
      messageApi.destroy();
      messageApi.success(`${provider} login successful!`);
      onLoginSuccess();
    }, 1000);
  };

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
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
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
              onVisibleChange: setPasswordVisible,
            }}
          />
        </Form.Item>

        <Form.Item
          className={styles.rememberMeContainer}
          name="remember"
          valuePropName="checked"
        >
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

        <Divider plain className={styles.divider}>
          or
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={() => handleSocialLogin("Google")}
          loading={formLoading || isLoading}
          className={styles.googleButton}
        >
          Sign in with Google
        </Button>
      </Form>
      <div className={styles.signupSection}>
        <Text className={styles.signupText}>New to Sapientia?</Text>
        <Link href="/signup" className={styles.signupLink}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
