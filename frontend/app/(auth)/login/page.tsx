"use client";

import LoginForm from "@/components/ui/Auth/LoginForm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Typography } from "antd";
import { slideContent } from "./slideContent";
import { isAuthenticated } from "@/lib/auth-utils";

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // For carousel/slider dots
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = slideContent.length;

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  // Auto-rotation for slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    router.push("/dashboard");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.splitScreen}>
        {/* Left panel with animated text */}
        <div className={styles.informationPanel}>
          <div className={styles.welcomeMessage}>
            <Title level={2} className={styles.welcomeTitle}>Welcome to Sapientia!</Title>
            <Title level={3} className={styles.welcomeSubtitle}>
              Sign in to continue your learning journey
            </Title>
          </div>
          <div className={styles.informationContent}>
            <div className={`${styles.quoteContainer} ${styles.fadeTransition}`}>
              <div className={styles.quoteSymbol}>&ldquo;</div>
              <Title level={2} className={styles.quoteText}>
                {slideContent[activeSlide].description}
              </Title>
              <Paragraph className={styles.quoteAuthor}>
                {slideContent[activeSlide].title}
              </Paragraph>
              <div className={styles.quoteSymbol2}>&rdquo;</div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className={styles.loginPanel}>
          <div className={styles.loginContainer}>
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;