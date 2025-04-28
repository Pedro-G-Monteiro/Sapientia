'use client';

import HeroImage from '@/public/images/hero-image.jpg';
import { PlayCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Typography } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from './HeroSection.module.css';

const { Title, Paragraph } = Typography;

// Define the stats items interface for better type checking
interface StatItem {
  value: string;
  label: string;
}

const HeroSection: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const toggleVideoModal = () => {
    setVideoModalOpen(!videoModalOpen);
  };

  // Stats data
  const stats: StatItem[] = [
    { value: '50K+', label: 'Students' },
    { value: '200+', label: 'Courses' },
    { value: '15+', label: 'Specialties' }
  ];

  return (
    <section className={styles.heroSection} id="home" aria-label="Hero section">
      {/* Decorative background elements */}
      <div className={styles.decorElement} aria-hidden="true"></div>
      
      <div className={styles.container}>
        <Row gutter={[24, 24]} align="middle" className={styles.heroRow}>
          <Col 
            xs={24} 
            md={12} 
            className={styles.heroContent}
            data-aos="fade-right" 
            data-aos-duration="1000"
          >
            <div className={styles.tagline}>
              <RocketOutlined aria-hidden="true" /> Innovative Educational Platform
            </div>
            
            <Title level={1} className={styles.heroTitle}>
              Transform Your Future with <span className={styles.highlight}>Digital</span> Knowledge
            </Title>
            
            <Paragraph className={styles.heroDescription}>
              Our platform offers high-quality courses in technology, design, and business.
              Learn at your own pace with the best industry experts and transform your career.
            </Paragraph>
            
            <Space size="large" className={styles.heroCta}>
              <Button 
                type="primary" 
                size="large" 
                shape="round" 
                className={styles.primaryButton}
                aria-label="Start now"
              >
                Start Now <RocketOutlined aria-hidden="true" />
              </Button>
              
              <Button 
                className={styles.videoButton} 
                type="link" 
                size="large"
                onClick={toggleVideoModal}
                aria-label="Watch how it works"
              >
                <PlayCircleOutlined aria-hidden="true" /> Watch how it works
              </Button>
            </Space>
            
            <div className={styles.statsContainer} aria-label="Platform statistics">
              {stats.map((stat, index) => (
                <div className={styles.statItem} key={index}>
                  <span className={styles.statNumber}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </Col>
          
          <Col 
            xs={24} 
            md={12} 
            className={styles.heroImageContainer}
            data-aos="fade-left" 
            data-aos-duration="1000" 
            data-aos-delay="300"
          >
            <div className={`${styles.imageWrapper} ${imageLoaded ? styles.imageLoaded : ''}`}>
              <div className={styles.imagePlaceholder} aria-hidden="true"></div>
              <Image 
                src={HeroImage} 
                alt="Digital education illustration showing people learning online" 
                width={600} 
                height={500}
                className={styles.heroImage}
                priority
                onLoad={handleImageLoad}
                quality={90}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Video modal */}
      {videoModalOpen && (
        <div className={styles.videoModal} role="dialog" aria-modal="true">
          <div className={styles.videoModalContent}>
            <button 
              className={styles.closeButton} 
              onClick={toggleVideoModal}
              aria-label="Close video"
            >
              &times;
            </button>
            <div className={styles.videoContainer}>
              <div className={styles.videoPlaceholder}>
                <p>Video content would appear here</p>
                <p>This is a demonstration of the modal functionality</p>
              </div>
            </div>
          </div>
          <div className={styles.modalOverlay} onClick={toggleVideoModal} aria-hidden="true"></div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;