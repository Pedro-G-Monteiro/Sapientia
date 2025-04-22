// components/ui/CourseCreation/Modals/AssignmentModal.tsx
"use client";

import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import { FormOutlined } from "@ant-design/icons";
import styles from "./AssignmentModal.module.css";

const { Text } = Typography;
const { TextArea } = Input;

interface AssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  lessonInfo: {
    moduleId: string;
    lessonId: string;
    moduleName: string;
    lessonName: string;
  } | null;
  onSave: (assignment: any) => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  visible,
  onClose,
  lessonInfo,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const assignment = {
        ...values,
        id: `assignment-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      onSave(assignment);
      form.resetFields();
      messageApi.success("Assignment saved successfully");
      onClose();
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className={styles.modalTitle}>
            <span>Create Assignment for {lessonInfo?.lessonName}</span>
            <Text type="secondary" className={styles.modalSubtitle}>
              {lessonInfo?.moduleName}
            </Text>
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={700}
        footer={null}
        className={styles.assignmentModal}
      >
        <div className={styles.modalContent}>
          <Form
            form={form}
            layout="vertical"
            requiredMark="optional"
            initialValues={{ points: 10 }}
          >
            <Form.Item
              name="title"
              label="Assignment Title"
              rules={[
                { required: true, message: "Please enter assignment title" },
              ]}
            >
              <Input placeholder="e.g. Final Project Submission" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Assignment Instructions"
              rules={[
                { required: true, message: "Please provide instructions" },
              ]}
            >
              <TextArea
                placeholder="Provide detailed instructions for the assignment..."
                rows={6}
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item
                name="dueDate"
                label="Due Date (Optional)"
                className={styles.formHalfItem}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm"
                  showTime
                  placeholder="Select date and time"
                />
              </Form.Item>

              <Form.Item
                name="points"
                label="Points Possible"
                rules={[{ required: true, message: "Please assign points" }]}
                className={styles.formHalfItem}
              >
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <Form.Item
              name="submissionFormat"
              label="Submission Format"
              rules={[
                { required: true, message: "Please specify submission format" },
              ]}
            >
              <Input placeholder="e.g. PDF, Word document, link to GitHub repository" />
            </Form.Item>

            <Form.Item name="evaluationCriteria" label="Evaluation Criteria">
              <TextArea
                placeholder="Describe how the assignment will be evaluated..."
                rows={4}
              />
            </Form.Item>
          </Form>

          <div className={styles.modalFooter}>
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="primary"
                icon={<FormOutlined />}
                onClick={handleSubmit}
              >
                Save Assignment
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AssignmentModal;
