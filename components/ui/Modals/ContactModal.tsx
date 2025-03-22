'use client';

import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  TeamOutlined
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Typography,
  message
} from 'antd';
import React, { useState } from 'react';
import styles from './ContactModal.module.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// Form values interface
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm<ContactFormValues>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (values: ContactFormValues) => {
    setSubmitLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form values:', values);
      // TODO: Replace with actual API call to your backend
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });
      
      message.success('Your message has been sent successfully! We\'ll get back to you soon.');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('There was an error sending your message. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      maskClosable={true}
      className={styles.contactModal}
      centered
      width={800}
      closeIcon={<span className={styles.modalCloseIcon}>×</span>}
      // Ensure modal background uses site theme
      styles={{
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        content: { backgroundColor: 'var(--bg-color)' }
      }}
    >
      <div className={styles.contactModalContainer}>
        {/* Left side - Contact Information */}
        <div className={styles.contactInfoSection}>
          <div className={styles.contactInfoContent}>
            <Title level={3} className={styles.contactInfoTitle}>
              Let's Connect
            </Title>
            <Paragraph className={styles.contactInfoDescription}>
              We're here to help with any questions you might have about our platform.
            </Paragraph>
            
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <TeamOutlined className={styles.contactIcon} />
                <div>
                  <Text strong className={styles.contactLabel}>Development Team</Text>
                  <Paragraph className={styles.contactText}>Sapientia Labs</Paragraph>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <EnvironmentOutlined className={styles.contactIcon} />
                <div>
                  <Text strong className={styles.contactLabel}>Office Location</Text>
                  <Paragraph className={styles.contactText}>123 Innovation Street<br />Tech District, TK 10101</Paragraph>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <PhoneOutlined className={styles.contactIcon} />
                <div>
                  <Text strong className={styles.contactLabel}>Phone</Text>
                  <Paragraph className={styles.contactText}>+1 (555) 123-4567</Paragraph>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <MailOutlined className={styles.contactIcon} />
                <div>
                  <Text strong className={styles.contactLabel}>Email</Text>
                  <Paragraph className={styles.contactText}>info@sapientia.com</Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Contact Form */}
        <div className={styles.contactFormSection}>
          <Title level={4} className={styles.contactFormTitle}>
            Send us a message
          </Title>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            name="contactForm"
            className={styles.contactForm}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Your name" size="large" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input placeholder="Your email address" size="large" />
            </Form.Item>
            
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Please enter your message' }]}
            >
              <TextArea 
                placeholder="How can we help you?" 
                rows={5} 
                size="large" 
              />
            </Form.Item>
            
            <Form.Item className={styles.formActions}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitLoading}
                className={styles.submitButton}
                icon={<SendOutlined />}
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;