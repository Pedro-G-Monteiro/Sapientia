'use client';

import ContactModal from '@/components/ui/Modals/ContactModal'; // Import the reusable component
import {
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './Footer.module.css';

const { Title, Paragraph, Text } = Typography;

const Footer: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();

  // Open contact modal
  const showContactModal = () => {
    setIsContactModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Logo & Tagline */}
          <div className={styles.brandSection}>
            <Title level={4} className={styles.brandTitle}>
              Knowledge <span className={styles.highlight}>Hub</span>
            </Title>
            <Paragraph className={styles.brandDescription}>
              Transforming learning through technology, collaboration, and shared knowledge.
            </Paragraph>
            <div className={styles.socialLinks} aria-label="Social media links">
              <Link href="#" className={styles.socialIcon} aria-label="GitHub">
                <GithubOutlined />
              </Link>
              <Link href="#" className={styles.socialIcon} aria-label="LinkedIn">
                <LinkedinOutlined />
              </Link>
              <Link href="#" className={styles.socialIcon} aria-label="Twitter">
                <TwitterOutlined />
              </Link>
            </div>
          </div>
        </div>
        
        <Divider className={styles.footerDivider} />
        
        <div className={styles.footerBottom}>
          <div className={styles.copyrightText}>
            <Text>© {currentYear} Knowledge Hub. All rights reserved.</Text>
          </div>
          <div className={styles.footerLinks}>
            <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="#" className={styles.footerLink}>Terms of Service</Link>
            <button 
              className={styles.contactLink} 
              onClick={showContactModal}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
        className={styles.backToTop}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* Using the reusable ContactModal component */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseModal} 
      />
    </footer>
  );
};

export default Footer;