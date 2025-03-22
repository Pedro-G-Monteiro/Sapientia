'use client';

import ContactModal from '@/components/ui/Modals/ContactModal';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Row, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './FAQ.module.css';

const { Title, Paragraph } = Typography;

// Define the FAQ item interface for better type checking
interface FAQItem {
  key: string;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [expandIconPosition] = useState<'start' | 'end'>('end');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const faqRef = useRef<HTMLDivElement>(null);

  // Animation for section entry
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => {
      if (faqRef.current) {
        observer.unobserve(faqRef.current);
      }
    };
  }, []);

  // Handle collapse change
  const handleCollapseChange = (keys: string | string[]) => {
    setActiveKeys(typeof keys === 'string' ? [keys] : keys);
  };

  // Open contact modal
  const showContactModal = () => {
    setIsContactModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsContactModalOpen(false);
  };

  // Custom expand icon with accessibility improvements
  const customExpandIcon = ({ isActive }: { isActive?: boolean }) => {
    return isActive ? (
      <MinusOutlined 
        className={styles.expandIcon} 
        aria-label="Collapse answer" 
      />
    ) : (
      <PlusOutlined 
        className={styles.expandIcon} 
        aria-label="Expand answer" 
      />
    );
  };

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      key: '1',
      question: 'How does the platform differ from a traditional LMS?',
      answer: 'Unlike a traditional LMS that primarily focuses on structured courses, our platform combines learning resources with a collaborative knowledge center. Users can not only access formatted content but also share experiences, ask questions, and collaborate in real-time, creating a dynamic and self-managed learning community.'
    },
    {
      key: '2',
      question: 'What types of organizations can benefit from the platform?',
      answer: 'Our platform is versatile and serves everything from technology companies and industries to educational institutions and non-profit organizations. Any organization that values knowledge sharing, continuous learning, and collaboration can benefit. We have clients from various sectors using the platform for different purposes, from corporate training to collaborative educational projects.'
    },
    {
      key: '3',
      question: 'What types of content can be shared on the platform?',
      answer: 'The platform supports a wide variety of formats: articles, tutorials, questions and answers, technical documentation, videos, podcasts, presentations, and even interactive content. Users can create, organize, and categorize content according to the specific needs of their organization or educational institution.'
    },
    {
      key: '4',
      question: 'Is it possible to customize the platform according to our visual identity?',
      answer: 'Yes, we offer various customization options to align the platform with your organization\'s visual identity. You can adjust colors, logos, fonts, and layouts, as well as create personalized sections to meet the specific needs of your community.'
    },
    {
      key: '5',
      question: 'How is the impact and success of platform implementation measured?',
      answer: 'The platform includes comprehensive analytical tools that allow you to track important metrics such as user engagement, collaboration, frequency of use, content quality, and learning impact. We also offer consulting to help define KPIs specific to your organization and track return on investment.'
    },
    {
      key: '6',
      question: 'How long does it take to implement the platform and see results?',
      answer: 'The basic implementation process typically takes 2 to 4 weeks, depending on the level of customization needed. Initial results are usually visible in 1 to 3 months, with increased engagement and knowledge sharing. More substantial benefits such as improved knowledge retention and team autonomy are typically measured after 6 months of continuous use.'
    }
  ];

  // Generate collapse items
  const collapseItems = faqItems.map(item => ({
    key: item.key,
    label: item.question,
    children: (
      <Paragraph className={styles.faqAnswer}>
        {item.answer}
      </Paragraph>
    ),
    className: `${styles.faqPanel} ${activeKeys.includes(item.key) ? styles.faqPanelActive : ''}`
  }));

  return (
    <section className={styles.faqSection} id="faq" ref={faqRef}>
      <div className={styles.decorElement} aria-hidden="true"></div>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            Frequently Asked <span className={styles.highlight}>Questions</span>
          </Title>
          <Paragraph className={styles.sectionDescription}>
            Find answers to the most common questions about our platform
          </Paragraph>
        </div>
        
        <Row justify="center">
          <Col xs={24} md={20} lg={18}>
            <Collapse 
              accordion 
              expandIconPosition={expandIconPosition}
              expandIcon={customExpandIcon}
              className={styles.faqCollapse}
              items={collapseItems}
              onChange={handleCollapseChange}
              ghost
            />
          </Col>
        </Row>
        
        <div className={styles.moreFaqContainer}>
          <Paragraph className={styles.moreFaqText}>
            Didn't find what you were looking for? Contact our team.
          </Paragraph>
          <Button 
            type="primary" 
            className={styles.contactButton}
            onClick={showContactModal}
            aria-label="Contact Us"
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Using the reusable ContactModal component */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default FAQ;