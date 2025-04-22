"use client";

import LoginForm from "@/components/ui/Auth/LoginForm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

// Educational quotes from notable figures
const slideContent = [
  {
    title: "Malcolm X",
    description: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
  },
  {
    title: "Nelson Mandela",
    description: "Education is the most powerful weapon which you can use to change the world."
  },
  {
    title: "Albert Einstein",
    description: "Education is not the learning of facts, but the training of the mind to think."
  },
  {
    title: "Malala Yousafzai",
    description: "One child, one teacher, one book, one pen can change the world."
  }
];

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // For carousel/slider dots
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = slideContent.length;

  // Auto-rotation for slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleLoginSuccess = () => {
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
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