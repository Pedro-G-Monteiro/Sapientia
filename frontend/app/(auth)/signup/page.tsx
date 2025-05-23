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
      setAnnouncementMessage("Account creation in progress...");
      
      // Se a senha estiver vazia, provavelmente é um login social que já está autenticado
      if (!userData.password) {
        setAnnouncementMessage("Account already authenticated. Redirecting to dashboard...");
        router.push("/dashboard");
        return;
      }
      
      // Importar registerAndLogin dinamicamente para evitar problemas de dependência circular
      const { registerAndLogin } = await import('@/lib/auth-utils');
      
      // Registrar e fazer login em uma única operação
      await registerAndLogin(userData);

      setAnnouncementMessage("Account created successfully. Redirecting to dashboard...");
      
      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error while authenticating:", error);
      setAnnouncementMessage("Error creating account. Please try again.");
      setIsLoading(false);
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