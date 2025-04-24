'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Space,
  Upload,
  Divider,
  Tag,
  Alert,
  Tooltip,
  Badge,
  Progress,
  Result
} from 'antd';
import {
  InboxOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
  SendOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from './AssignmentComponent.module.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface ResourceFile {
  name: string;
  url: string;
  type: string;
  size?: number;
}

interface AssignmentDetails {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  pointsPossible: number;
  resources?: ResourceFile[];
  submission?: {
    submittedAt?: string;
    text?: string;
    files?: UploadFile[];
    grade?: number;
    feedback?: string;
    status: 'not_submitted' | 'submitted' | 'graded' | 'late';
  };
}

interface AssignmentComponentProps {
  assignment: AssignmentDetails;
  onSubmit: (text: string, files: UploadFile[]) => void;
  onCancel?: () => void;
}

const AssignmentComponent: React.FC<AssignmentComponentProps> = ({
  assignment,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!assignment.submission?.submittedAt);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Calcular o estado atual do assignment
  const isSubmitted = assignment.submission?.status === 'submitted' || assignment.submission?.status === 'graded';
  const isGraded = assignment.submission?.status === 'graded';
  const isLate = assignment.submission?.status === 'late';
  const isUpcoming = new Date(assignment.dueDate || '') > new Date();
  
  // Calcular o tempo restante até o prazo
  const getTimeRemaining = () => {
    if (!assignment.dueDate) return 'No due date';
    
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Past due';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
    }
  };
  
  // Props para o componente Upload
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      // Adicionar arquivo à lista sem fazer upload imediatamente
      setFileList([...fileList, file]);
      return false;
    },
    onRemove: (file) => {
      // Remover arquivo da lista
      setFileList(fileList.filter(item => item.uid !== file.uid));
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent!.toFixed(2))}%`,
    },
  };

  // Simular o upload de arquivo com progresso
  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    return interval;
  };

  // Manipular o envio do formulário
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    
    try {
      // Simular o upload de arquivos
      const uploadInterval = simulateUpload();
      
      // Simular o tempo de envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Chamar a função de envio
      onSubmit(values.text, fileList);
      
      // Atualizar estado
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar a parte de recursos do assignment
  const renderResources = () => {
    if (!assignment.resources || assignment.resources.length === 0) {
      return null;
    }

    return (
      <div className={styles.resourcesSection}>
        <Title level={5}>Resources</Title>
        <div className={styles.resourcesList}>
          {assignment.resources.map((resource, index) => (
            <div key={index} className={styles.resourceItem}>
              <div className={styles.resourceIcon}>
                {resource.type === 'pdf' ? (
                  <FileTextOutlined />
                ) : (
                  <LinkOutlined />
                )}
              </div>
              <div className={styles.resourceInfo}>
                <div className={styles.resourceName}>{resource.name}</div>
                <div className={styles.resourceMeta}>
                  {resource.type.toUpperCase()} • {resource.size ? `${Math.round(resource.size / 1024)} KB` : 'Resource'}
                </div>
              </div>
              <Button 
                type="link" 
                icon={<DownloadOutlined />}
                className={styles.resourceDownload}
                href={resource.url}
                target="_blank"
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar formulário de submissão
  const renderSubmissionForm = () => {
    return (
      <div className={styles.submissionFormContainer}>
        <Title level={4}>Submit Your Work</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            text: assignment.submission?.text || '',
          }}
        >
          <Form.Item
            name="text"
            label="Your Answer"
            rules={[{ required: true, message: 'Please provide your answer' }]}
          >
            <TextArea
              ref={textAreaRef}
              rows={8}
              placeholder="Write your answer here..."
              className={styles.submissionTextarea}
            />
          </Form.Item>

          <Form.Item label="Attach Files (Optional)">
            <Dragger {...uploadProps} className={styles.uploader}>
              <p className={styles.uploaderIcon}>
                <InboxOutlined />
              </p>
              <p className={styles.uploaderText}>Click or drag files to this area to upload</p>
              <p className={styles.uploaderHint}>
                Support for single or bulk upload. Allowed file types: .pdf, .doc, .docx, .png, .jpg, .zip
              </p>
            </Dragger>
          </Form.Item>
          
          {fileList.length > 0 && (
            <div className={styles.attachmentsList}>
              <Title level={5}>Attached Files</Title>
              {fileList.map(file => (
                <div key={file.uid} className={styles.attachmentItem}>
                  <div className={styles.attachmentIcon}>
                    <PaperClipOutlined />
                  </div>
                  <div className={styles.attachmentName}>{file.name}</div>
                  <div className={styles.attachmentSize}>
                    {file.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown size'}
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setFileList(fileList.filter(item => item.uid !== file.uid))}
                    className={styles.attachmentRemove}
                  />
                </div>
              ))}
            </div>
          )}

          <Form.Item className={styles.submitActions}>
            {onCancel && (
              <Button onClick={onCancel}>
                Cancel
              </Button>
            )}
            
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={submitting}
              icon={<SendOutlined />}
            >
              Submit Assignment
            </Button>
          </Form.Item>
        </Form>
        
        {submitting && (
          <div className={styles.uploadProgress}>
            <Progress percent={uploadProgress} status="active" />
          </div>
        )}
      </div>
    );
  };

  // Renderizar submission graded
  const renderGradedSubmission = () => {
    if (!assignment.submission || !isGraded) return null;
    
    const { grade, feedback, submittedAt } = assignment.submission;
    const scorePercentage = grade ? (grade / assignment.pointsPossible) * 100 : 0;
    
    return (
      <div className={styles.gradedContainer}>
        <Result
          status={scorePercentage >= 70 ? "success" : "warning"}
          title={`Your Grade: ${grade}/${assignment.pointsPossible} points (${scorePercentage.toFixed(1)}%)`}
          subTitle={`Submitted on ${new Date(submittedAt || '').toLocaleDateString()}`}
        />
        
        {feedback && (
          <div className={styles.feedbackContainer}>
            <Title level={5}>Instructor Feedback</Title>
            <div className={styles.feedbackContent}>
              <Paragraph>{feedback}</Paragraph>
            </div>
          </div>
        )}
        
        {assignment.submission.text && (
          <div className={styles.submissionPreview}>
            <Title level={5}>Your Submission</Title>
            <div className={styles.submissionText}>
              <Paragraph>{assignment.submission.text}</Paragraph>
            </div>
          </div>
        )}
        
        {assignment.submission.files && assignment.submission.files.length > 0 && (
          <div className={styles.submissionFiles}>
            <Title level={5}>Attached Files</Title>
            {assignment.submission.files.map((file, index) => (
              <div key={index} className={styles.submittedFile}>
                <FileTextOutlined className={styles.fileIcon} />
                <Text>{file.name}</Text>
                {file.url && (
                  <Button 
                    size="small" 
                    type="link" 
                    icon={<DownloadOutlined />}
                    href={file.url}
                    target="_blank"
                  >
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Renderizar submission pendente
  const renderPendingSubmission = () => {
    if (!assignment.submission || !isSubmitted || isGraded) return null;

    return (
      <div className={styles.pendingContainer}>
        <Alert
          message="Submission Received"
          description="Your assignment has been submitted and is waiting to be graded."
          type="success"
          showIcon
          className={styles.submissionAlert}
        />
        
        {assignment.submission.submittedAt && (
          <div className={styles.submissionInfo}>
            <Text>Submitted on {new Date(assignment.submission.submittedAt).toLocaleDateString()}</Text>
          </div>
        )}
        
        {assignment.submission.text && (
          <div className={styles.submissionPreview}>
            <Title level={5}>Your Submission</Title>
            <div className={styles.submissionText}>
              <Paragraph>{assignment.submission.text}</Paragraph>
            </div>
          </div>
        )}
        
        {assignment.submission.files && assignment.submission.files.length > 0 && (
          <div className={styles.submissionFiles}>
            <Title level={5}>Attached Files</Title>
            {assignment.submission.files.map((file, index) => (
              <div key={index} className={styles.submittedFile}>
                <FileTextOutlined className={styles.fileIcon} />
                <Text>{file.name}</Text>
                {file.url && (
                  <Button 
                    size="small" 
                    type="link" 
                    icon={<DownloadOutlined />}
                    href={file.url}
                    target="_blank"
                  >
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.assignmentContainer}>
      <Card className={styles.assignmentCard}>
        <div className={styles.assignmentHeader}>
          <Title level={3} className={styles.assignmentTitle}>{assignment.title}</Title>
          
          <div className={styles.assignmentMeta}>
            {assignment.dueDate && (
              <div className={styles.dueDateContainer}>
                <ClockCircleOutlined className={styles.dueDateIcon} />
                <Tooltip title={new Date(assignment.dueDate).toLocaleString()}>
                  <Badge 
                    status={isLate ? "error" : isUpcoming ? "processing" : "warning"} 
                    text={
                      <Text className={isLate ? styles.lateBadge : ''}>
                        {isLate ? 'Past Due' : getTimeRemaining()}
                      </Text>
                    } 
                  />
                </Tooltip>
              </div>
            )}
            
            <div className={styles.pointsContainer}>
              <Text className={styles.pointsText}>
                {assignment.pointsPossible} points
              </Text>
            </div>
          </div>
        </div>
        
        <Divider />
        
        <div className={styles.assignmentDescription}>
          <div dangerouslySetInnerHTML={{ __html: assignment.description }} />
        </div>
        
        {renderResources()}
        
        <Divider />
        
        {isGraded ? (
          renderGradedSubmission()
        ) : isSubmitted ? (
          renderPendingSubmission()
        ) : (
          renderSubmissionForm()
        )}
      </Card>
    </div>
  );
};

export default AssignmentComponent;