// components/ui/CourseCreation/Steps/PublishingOptions.tsx
"use client";

import React from "react";
import { 
  Alert,
  Card, 
  Checkbox, 
  Col, 
  DatePicker, 
  Form, 
  Radio, 
  Row, 
  Space, 
  Statistic, 
  Typography 
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  GlobalOutlined,
  TeamOutlined
} from "@ant-design/icons";
import styles from "./PublishingOptions.module.css";

const { Title, Text, Paragraph } = Typography;

interface PublishSettings {
  isPublished: boolean;
  isPublic: boolean;
  publishDate?: string;
  enrollmentType?: 'open' | 'invite_only' | 'paid';
  requiresApproval?: boolean;
}

interface PublishingOptionsProps {
  data: PublishSettings;
  courseInfo: {
    title: string;
    description: string;
    thumbnailUrl?: string;
    level?: string;
    durationHours?: number;
    price?: number;
    isFree?: boolean;
  };
  moduleCount: number;
  onSave: (data: PublishSettings) => void;
}

const PublishingOptions: React.FC<PublishingOptionsProps> = ({ 
  data, 
  courseInfo, 
  moduleCount, 
  onSave 
}) => {
  const [form] = Form.useForm();

  const handleFormChange = (changedValues: any, allValues: any) => {
    onSave(allValues);
  };

  // Contar o número de lições
  const countLessons = () => {
    // Na implementação real, isso seria feito a partir dos dados do curso
    return 12; // Valor de exemplo
  };

  // Calcular a pontuação de completude do curso
  const calculateCompletionScore = () => {
    let score = 0;
    
    // Título e descrição
    if (courseInfo.title) score += 20;
    if (courseInfo.description && courseInfo.description.length > 50) score += 15;
    
    // Thumbnail
    if (courseInfo.thumbnailUrl) score += 10;
    
    // Informações de nível e duração
    if (courseInfo.level) score += 5;
    if (courseInfo.durationHours && courseInfo.durationHours > 0) score += 5;
    
    // Módulos e lições
    if (moduleCount > 0) score += 20;
    if (countLessons() > 0) score += 20;
    
    return Math.min(score, 100);
  };

  return (
    <div className={styles.publishingContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            initialValues={data}
            onValuesChange={handleFormChange}
            requiredMark="optional"
            className={styles.publishForm}
          >
            <Title level={4}>Publishing Options</Title>
            <Paragraph className={styles.sectionDescription}>
              Configure how your course will be published and who can access it.
            </Paragraph>
            
            <Form.Item 
              name="isPublished" 
              valuePropName="checked"
              className={styles.publishedItem}
            >
              <Checkbox>
                <span className={styles.checkboxLabel}>Publish this course</span>
                <Text type="secondary" className={styles.checkboxDescription}>
                  When checked, this course will be visible according to the settings below
                </Text>
              </Checkbox>
            </Form.Item>
            
            <Form.Item
              name="publishDate"
              label="Publication Date"
              tooltip="Leave empty to publish immediately"
            >
              <DatePicker 
                format="YYYY-MM-DD HH:mm" 
                placeholder="Select date and time"
                showTime 
                className={styles.datePicker}
              />
            </Form.Item>
            
            <Title level={5} className={styles.sectionTitle}>Visibility</Title>
            
            <Form.Item
              name="isPublic"
              valuePropName="checked"
              className={styles.visibilityItem}
            >
              <Checkbox>
                <span className={styles.checkboxLabel}>Make course publicly visible</span>
                <Text type="secondary" className={styles.checkboxDescription}>
                  Anyone can find and view the course details
                </Text>
              </Checkbox>
            </Form.Item>
            
            <Title level={5} className={styles.sectionTitle}>Enrollment</Title>
            
            <Form.Item
              name="enrollmentType"
              label="Who can enroll in this course?"
            >
              <Radio.Group className={styles.enrollmentOptions}>
                <Space direction="vertical">
                  <Radio value="open">
                    <div className={styles.radioOption}>
                      <span className={styles.radioLabel}>Open Enrollment</span>
                      <Text type="secondary" className={styles.radioDescription}>
                        Anyone can enroll in this course
                      </Text>
                    </div>
                  </Radio>
                  
                  <Radio value="invite_only">
                    <div className={styles.radioOption}>
                      <span className={styles.radioLabel}>Invitation Only</span>
                      <Text type="secondary" className={styles.radioDescription}>
                        Only invited users or members of your organization can enroll
                      </Text>
                    </div>
                  </Radio>
                  
                  <Radio value="paid">
                    <div className={styles.radioOption}>
                      <span className={styles.radioLabel}>Paid Enrollment</span>
                      <Text type="secondary" className={styles.radioDescription}>
                        Users must purchase the course to enroll (Price: ${courseInfo.price || 0})
                      </Text>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              name="requiresApproval"
              valuePropName="checked"
              className={styles.approvalItem}
            >
              <Checkbox>
                <span className={styles.checkboxLabel}>Require enrollment approval</span>
                <Text type="secondary" className={styles.checkboxDescription}>
                  You'll need to approve each student's enrollment request
                </Text>
              </Checkbox>
            </Form.Item>
          </Form>
        </Col>
        
        <Col xs={24} lg={8}>
          <div className={styles.summaryContainer}>
            <Card className={styles.summaryCard}>
              <Title level={4}>Course Summary</Title>
              
              <div className={styles.completionScore}>
                <Statistic 
                  title="Completion Score" 
                  value={calculateCompletionScore()} 
                  suffix="%" 
                  valueStyle={{ 
                    color: calculateCompletionScore() >= 80 
                      ? 'var(--success-color)' 
                      : calculateCompletionScore() >= 50 
                        ? 'var(--warning-color)' 
                        : 'var(--error-color)' 
                  }}
                />
                
                {calculateCompletionScore() < 80 && (
                  <Alert 
                    message="Your course could use more details" 
                    type="warning" 
                    showIcon 
                    className={styles.completionAlert}
                  />
                )}
                
                {calculateCompletionScore() >= 80 && (
                  <Alert 
                    message="Your course is ready to publish" 
                    type="success" 
                    showIcon 
                    className={styles.completionAlert}
                  />
                )}
              </div>
              
              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <BookOutlined className={styles.metaIcon} />
                  <Text>{moduleCount} modules</Text>
                </div>
                
                <div className={styles.metaItem}>
                  <FileTextOutlined className={styles.metaIcon} />
                  <Text>{countLessons()} lessons</Text>
                </div>
                
                {courseInfo.durationHours && (
                  <div className={styles.metaItem}>
                    <ClockCircleOutlined className={styles.metaIcon} />
                    <Text>{courseInfo.durationHours} hours</Text>
                  </div>
                )}
                
                <div className={styles.metaItem}>
                  <GlobalOutlined className={styles.metaIcon} />
                  <Text>{data.isPublic ? 'Public' : 'Private'}</Text>
                </div>
                
                {courseInfo.isFree ? (
                  <div className={styles.metaItem}>
                    <CheckCircleOutlined className={styles.metaIcon} />
                    <Text>Free course</Text>
                  </div>
                ) : (
                  <div className={styles.metaItem}>
                    <DollarOutlined className={styles.metaIcon} />
                    <Text>${courseInfo.price || 0}</Text>
                  </div>
                )}
                
                <div className={styles.metaItem}>
                  <TeamOutlined className={styles.metaIcon} />
                  <Text>{data.enrollmentType === 'invite_only' 
                    ? 'Invite only' 
                    : data.enrollmentType === 'paid' 
                      ? 'Paid enrollment' 
                      : 'Open enrollment'
                  }</Text>
                </div>
              </div>
            </Card>
            
            <div className={styles.publishingTips}>
              <Title level={5}>Publishing Tips</Title>
              <ul className={styles.tipsList}>
                <li>Make sure your course title clearly communicates what students will learn</li>
                <li>Add a compelling course image to attract students</li>
                <li>Break content into digestible modules and lessons</li>
                <li>Add quizzes or assignments to test student understanding</li>
                <li>Consider pricing that reflects the value of your content</li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PublishingOptions;