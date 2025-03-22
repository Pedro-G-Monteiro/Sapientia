'use client';

import {
  BookOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  RiseOutlined,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Col, Row, Statistic, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './OrganizationBenefits.module.css';

const { Title, Paragraph } = Typography;

// Define interfaces for data types
interface StatisticItem {
  id: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  title: string;
}

interface BenefitItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const OrganizationBenefits: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState<boolean>(false);
  const [visibleBenefits, setVisibleBenefits] = useState<string[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  // Store animated values for statistics
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Data for statistics
  const statistics: StatisticItem[] = [
    {
      id: 'engagement',
      value: 27,
      suffix: '%',
      icon: <RiseOutlined />,
      title: 'Increase in Engagement'
    },
    {
      id: 'adaptation',
      value: 68,
      suffix: '%',
      icon: <ClockCircleOutlined />,
      title: 'Reduction in Adaptation Time'
    },
    {
      id: 'retention',
      value: 41,
      suffix: '%',
      icon: <BookOutlined />,
      title: 'Improvement in Learning Retention'
    }
  ];

  // Data for benefits
  const benefits: BenefitItem[] = [
    {
      id: 'unified-knowledge',
      icon: <SafetyOutlined />,
      title: 'Unified Knowledge Center',
      description: 'Centralize resources, teaching materials, and organizational knowledge in a single location accessible to all members of your community.'
    },
    {
      id: 'enhanced-collaboration',
      icon: <LineChartOutlined />,
      title: 'Enhanced Collaboration',
      description: 'Facilitate the exchange of ideas and experiences between students, teachers, or collaborators, creating an environment conducive to innovation and continuous learning.'
    },
    {
      id: 'autonomy',
      icon: <ThunderboltOutlined />,
      title: 'Autonomy and Self-Management',
      description: 'Promote independence in learning and problem-solving, reducing dependencies and developing research and self-management skills.'
    }
  ];

  // Initialize animated values
  useEffect(() => {
    const initialValues: Record<string, number> = {};
    statistics.forEach(stat => {
      initialValues[stat.id] = 0;
    });
    setAnimatedValues(initialValues);
  }, []);

  // Animate statistics when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          setAnimatedStats(true);
        }
      });
    }, { 
      threshold: 0.2 
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [animatedStats]);

  // Animate benefits when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setVisibleBenefits(prev => [...prev, entry.target.id]);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const items = document.querySelectorAll(`.${styles.benefitItem}`);
    items.forEach(item => observer.observe(item));

    return () => {
      items.forEach(item => observer.unobserve(item));
    };
  }, []);

  // Animate counter for statistics
  useEffect(() => {
    if (animatedStats) {
      statistics.forEach(stat => {
        let start = 0;
        const increment = stat.value / 40; // Divide by number of steps
        const timer = setInterval(() => {
          start += increment;
          if (start > stat.value) {
            setAnimatedValues(prev => ({
              ...prev,
              [stat.id]: stat.value
            }));
            clearInterval(timer);
          } else {
            setAnimatedValues(prev => ({
              ...prev,
              [stat.id]: Math.floor(start)
            }));
          }
        }, 30);

        return () => {
          clearInterval(timer);
        };
      });
    }
  }, [animatedStats]);

  return (
    <section className={styles.benefitsSection} id="benefits">
      {/* Decorative element */}
      <div className={styles.decorElement} aria-hidden="true"></div>
      
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            Transform Your <span className={styles.highlight}>Community</span>
          </Title>
          <Paragraph className={styles.sectionDescription}>
            Our platform helps companies and educational institutions overcome learning, knowledge sharing, 
            and collaboration challenges, generating tangible results
          </Paragraph>
        </div>
        
        <div className={styles.impactStats} ref={statsRef}>
          <Row gutter={[32, 32]} justify="center" align="middle">
            {statistics.map((stat) => (
              <Col xs={24} sm={8} key={stat.id}>
                <div className={`${styles.statCard} ${animatedStats ? styles.animated : ''}`}>
                  <Statistic 
                    value={animatedValues[stat.id]} 
                    suffix={stat.suffix} 
                    valueStyle={{ color: 'var(--primary-color)' }}
                    prefix={stat.icon}
                  />
                  <div className={styles.statTitle}>{stat.title}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        
        <div className={styles.benefitsContent} ref={benefitsRef}>
          <Title level={3} className={styles.benefitsGroupTitle}>
            Strategic Benefits
          </Title>
          
          <Row gutter={[40, 40]}>
            {benefits.map((benefit, index) => (
              <Col xs={24} md={8} key={benefit.id}>
                <div 
                  id={benefit.id}
                  className={`${styles.benefitItem} ${visibleBenefits.includes(benefit.id) ? styles.visible : ''}`}
                  tabIndex={0}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={styles.benefitIcon} aria-hidden="true">
                    {benefit.icon}
                  </div>
                  <div className={styles.benefitContent}>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        
        <div 
          className={styles.casesHighlight}
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className={styles.caseContent}>
            <div className={styles.caseTag}>SUCCESS STORY</div>
            <Title level={3} className={styles.caseTitle}>
              &quot;Students began sharing knowledge in a much more effective way, creating a true collaborative learning community.&quot;
            </Title>
            <div className={styles.caseAuthor}>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Prof. Andrew Martin</div>
                <div className={styles.authorPosition}>Pedagogical Coordinator, Future Educational Institute</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationBenefits;