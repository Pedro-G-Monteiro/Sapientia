"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  Typography,
  message,
  Divider,
  FormInstance,
} from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./BasicInfoForm.module.css";
import type { UploadFile } from "antd/es/upload/interface";
import CourseCard from "../../Cards/Courses/CourseCard";
import { debounce } from "lodash";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface BasicInfoData {
  title: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  durationHours: number;
  price: number;
}

interface BasicInfoFormProps {
  data: BasicInfoData;
  onSave: (data: BasicInfoData) => void;
  form: FormInstance;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onSave, form }) => {
  const [previewData, setPreviewData] = useState<BasicInfoData>(data);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Set initial form values
  useEffect(() => {
    form.setFieldsValue({
      ...data,
    });

    if (data.thumbnailUrl) {
      setFileList([
        {
          uid: "-1",
          name: "thumbnail.png",
          status: "done",
          url: data.thumbnailUrl,
        },
      ]);
    }
  }, []);

  // Handle form values change
  const debouncedSave = useMemo(() => debounce(onSave, 1000), [onSave]);

  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getFieldsValue();
      const updatedData = {
        ...values,
        thumbnailUrl: values.thumbnailUrl || data.thumbnailUrl,
      };

      setPreviewData(updatedData);
      debouncedSave(updatedData);
    }, 100); // Atualiza a cada meio segundo (evita overload)

    return () => clearInterval(interval);
  }, [form, data.thumbnailUrl, debouncedSave]);

  const uploadProps = {
    beforeUpload: (file: UploadFile) => {
      const isImage = file.type?.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const localUrl = URL.createObjectURL(file as any);
      form.setFieldsValue({ thumbnailUrl: localUrl });

      const updatedValues = {
        ...form.getFieldsValue(),
        thumbnailUrl: localUrl,
      };

      setPreviewData(updatedValues);
      onSave(updatedValues);

      // Add to fileList
      setFileList([
        {
          uid: "-1",
          name: file.name || "thumbnail.png",
          status: "done",
          url: localUrl,
        },
      ]);

      return false;
    },
    fileList,
    onRemove: () => {
      form.setFieldsValue({ thumbnailUrl: "" });
      setFileList([]);

      const updatedValues = {
        ...form.getFieldsValue(),
        thumbnailUrl: "",
      };

      setPreviewData(updatedValues);
      onSave(updatedValues);
    },
  };

  const getPreviewProps = () => ({
    courseId: 0, // Temporary ID for preview
    title: previewData.title || "Course Title",
    description:
      previewData.description || "Course description will appear here",
    thumbnailUrl: previewData.thumbnailUrl,
    level: previewData.level as
      | "Beginner"
      | "Intermediate"
      | "Advanced"
      | "All Levels",
    durationHours: previewData.durationHours,
    isFree: true, // Always free
    isPublished: false,
    isPreview: true,
  });

  return (
    <div className={styles.basicInfoContainer}>
      <div className={styles.formPreviewLayout}>
        <div className={styles.formSection}>
          <Title level={4}>Course Information</Title>
          <Text type="secondary" className={styles.sectionDescription}>
            Provide the essential details about your course.
          </Text>

          <Form
            form={form}
            layout="vertical"
            className={styles.form}
            requiredMark="optional"
          >
            <Form.Item
              name="title"
              label="Course Title"
              rules={[
                { required: true, message: "Please enter the course title" },
                { max: 100, message: "Title must be maximum 100 characters" },
              ]}
              tooltip={{
                title:
                  "A clear, specific title that describes what students will learn",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input placeholder="e.g. Introduction to JavaScript" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Course Description"
              rules={[
                {
                  required: true,
                  message: "Please enter the course description",
                },
              ]}
              tooltip="Explain what the course is about and what students will learn"
            >
              <TextArea
                placeholder="Describe your course content, objectives, and outcomes..."
                rows={6}
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item
                name="level"
                label="Course Level"
                rules={[{ required: true }]}
                className={styles.formHalfItem}
              >
                <Select placeholder="Select level">
                  <Option value="Beginner">Beginner</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                  <Option value="All Levels">All Levels</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="durationHours"
                label="Estimated Duration (hours)"
                rules={[{ required: true }]}
                className={styles.formHalfItem}
              >
                <InputNumber
                  min={0}
                  max={1000}
                  placeholder="e.g. 10"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <div className={styles.formRow}>
              <Form.Item
                name="thumbnailUrl"
                label="Thumbnail Image"
                className={styles.formHalfItem}
              >
                <Upload
                  {...uploadProps}
                  listType="picture"
                  maxCount={1}
                  className={styles.uploader}
                >
                  <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                </Upload>
              </Form.Item>
            </div>
          </Form>
        </div>

        <Divider type="vertical" className={styles.divider} />

        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <Title level={4}>Course Preview</Title>
            <Text type="secondary">
              This is how your course will appear to students
            </Text>
          </div>

          <div className={styles.courseCardPreview}>
            <CourseCard {...getPreviewProps()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
