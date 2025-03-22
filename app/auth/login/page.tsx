'use client';

import LoginForm from '@/components/ui/Auth/LoginForm';
import Footer from '@/components/ui/LandingPage/Body/Footer';
import LandingHeader from '@/components/ui/LandingPage/Header/LandingHeader';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './login.module.css';

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme detection
  useEffect(() => {
    // Skip on server-side rendering
    if (!mounted) return;

    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Listen for changes in system preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleThemeChange);
    
    // Cleanup
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [mounted]);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  // Avoid flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Sign In | Sapientia Knowledge Hub</title>
        <meta name="description" content="Sign in to Sapientia to continue your learning journey" />
      </Head>
      
      <div className={`${styles.pageContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
        <LandingHeader />
        
        <main className={styles.mainContent}>
          <div className={styles.loginSection}>
            <LoginForm onLoginSuccess={handleLoginSuccess} isLoading={isLoading} />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;