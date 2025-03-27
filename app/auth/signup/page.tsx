"use client";

import SignUpForm from "@/components/ui/Auth/SignUpForm";
import { Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

const { Title, Paragraph } = Typography;

// Benefits of joining Sapientia
const benefits = [
  {
    title: "Personalized Learning Paths",
    description: "Customized curriculum tailored to your unique goals and learning style."
  },
  {
    title: "Expert Instructors",
    description: "Learn from industry professionals with real-world experience."
  },
  {
    title: "Flexible Schedule",
    description: "Study at your own pace with 24/7 access to all course materials."
  },
  {
    title: "Interactive Exercises",
    description: "Reinforce your knowledge through hands-on projects and exercises."
  }
];

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const handleSignUpSuccess = () => {
    setIsLoading(true);
    setAnnouncementMessage("Account created successfully. Redirecting to dashboard...");
    console.log(announcementMessage);

    // Simulate authentication delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
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