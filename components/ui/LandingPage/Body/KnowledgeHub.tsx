'use client';

import {
  ArrowRightOutlined,
  BulbOutlined,
  GlobalOutlined,
  RocketOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './KnowledgeHub.module.css';

const { Title, Paragraph } = Typography;

// Define feature card interface for type checking
interface FeatureCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Define feature list interface
interface FeatureListItem {
  id: string;
  text: string;
}

const KnowledgeHub: React.FC = () => {
  const [animatedCards, setAnimatedCards] = useState<string[]>([]);

  // Animation logic for feature cards
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setAnimatedCards(prev => [...prev, entry.target.id]);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    const cards = document.querySelectorAll(`.${styles.featureCard}`);
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  // Data for feature cards
  const featureCards: FeatureCard[] = [
    {
      id: 'exclusive-courses',
      icon: <RocketOutlined />,
      title: 'Exclusive Courses',
      description: 'Each organization has access to a catalog of exclusive courses tailored to their specific needs. Selected content for the continuous development of your team.'
    },
    {
      id: 'custom-content',
      icon: <BulbOutlined />,
      title: 'Personalized Content',
      description: 'Create your own courses and learning paths with our intuitive authoring tools. Share your organization\'s specific knowledge in a structured way.'
    },
    {
      id: 'collaborative-learning',
      icon: <TeamOutlined />,
      title: 'Collaborative Learning',
      description: 'Promote knowledge sharing and team skill development. Create communities of practice and encourage a culture of continuous learning.'
    }
  ];

  // Data for feature list
  const featureList: FeatureListItem[] = [
    {
      id: 'feature-1',
      text: 'Create and publish detailed technical articles'
    },
    {
      id: 'feature-2',
      text: 'Share experiences and best practices'
    },
    {
      id: 'feature-3',
      text: 'Ask questions and receive answers from the community'
    },
    {
      id: 'feature-4',
      text: 'Participate in discussions on relevant topics'
    },
    {
      id: 'feature-5',
      text: 'Build a collective knowledge library'
    }
  ];

  return (
    <section className={styles.featuresSection} id="knowledge">
      <div className={styles.decorElement} aria-hidden="true"></div>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            Knowledge <span className={styles.highlight}>Hub</span>
          </Title>
          <Paragraph className={styles.sectionDescription}>
            A comprehensive platform for continuous learning, content creation, and knowledge sharing between teams
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]} className={styles.featuresRow}>
          {featureCards.map((card, index) => (
            <Col xs={24} md={8} key={card.id}>
              <Card 
                className={`${styles.featureCard} ${animatedCards.includes(card.id) ? styles.animated : ''}`}
                id={card.id}
                tabIndex={0}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={styles.featureIcon} aria-hidden="true">
                  {card.icon}
                </div>
                <Title level={3} className={styles.featureTitle}>{card.title}</Title>
                <Paragraph className={styles.featureText}>
                  {card.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className={styles.knowledgeHubSection}>
          <div className={styles.knowledgeHubContent}>
            <div className={styles.hubIcon} aria-hidden="true">
              <GlobalOutlined />
            </div>
            <Title level={2} className={styles.hubTitle}>
              Sharing Community
            </Title>
            <Paragraph className={styles.hubDescription}>
              Our platform also includes a dedicated space for knowledge sharing! Here, members can:
            </Paragraph>
            
            <ul className={styles.hubFeaturesList} aria-label="Community features">
              {featureList.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
            
            <Button 
              type="primary" 
              size="large" 
              className={styles.hubButton}
              aria-label="Explore the Knowledge Hub"
            >
              Explore the Knowledge Hub <ArrowRightOutlined aria-hidden="true" />
            </Button>
          </div>
          
          <div className={styles.knowledgeHubGraphic} aria-hidden="true">
            <div className={styles.graphicBg}></div>
            <div className={styles.graphicElement1}></div>
            <div className={styles.graphicElement2}></div>
            <div className={styles.graphicElement3}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHub;