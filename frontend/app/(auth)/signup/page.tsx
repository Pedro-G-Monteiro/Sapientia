"use client";

import SignUpForm from "@/components/ui/Auth/SignUpForm";
import { Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import { benefits } from "./benefits";

const { Title, Paragraph } = Typography;

interface SignUpData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const handleSignUpSuccess = async (userData: SignUpData) => {
    try {
      setIsLoading(true);
      setAnnouncementMessage("Account created successfully. Authenticating...");
      console.log("Attempting to authenticate with:", userData);
      
      // Realizar autenticação real com o backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const authData = await response.json();
      
      // Armazenar token JWT ou dados de sessão
      localStorage.setItem('authToken', authData.token);

      setAnnouncementMessage("Authentication successful. Redirecting to dashboard...");
      
      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error while performing authentication:", error);
      setAnnouncementMessage("Error during authentication. Please try again.");
      setIsLoading(false);
      
      // Redirecionar para a página de login após pequeno delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className={styles.signupPage}>
      <main id="main-content" className={styles.splitScreen}>
        {/* Left panel with benefits */}
        <div 
          className={`${styles.informationPanel} ${styles.signupInfoPanel}`}
          aria-labelledby="welcome-title"
        >
          <div className={styles.welcomeMessage}>
            <Title level={2} id="welcome-title" className={styles.welcomeTitle}>
              Join Sapientia Today!
            </Title>
            <Title level={3} className={styles.welcomeSubtitle}>
              Create an account to start your learning journey
            </Title>
          </div>
          
          <div className={styles.benefitsContainer} role="list" aria-label="Benefits of joining Sapientia">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={styles.benefitItem} 
                role="listitem"
              >
                <div className={styles.benefitNumber} aria-hidden="true">{index + 1}</div>
                <div className={styles.benefitContent}>
                  <Title level={4} className={styles.benefitTitle}>
                    {benefit.title}
                  </Title>
                  <Paragraph className={styles.benefitDescription}>
                    {benefit.description}
                  </Paragraph>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right signup panel */}
        <div className={styles.signupPanel} role="region" aria-label="Signup form">
          <div className={styles.signupContainer}>
            <SignUpForm
              onSignUpSuccess={handleSignUpSuccess}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;