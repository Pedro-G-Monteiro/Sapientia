// components/ui/CourseCreation/Steps/LessonManager.tsx
"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Collapse,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import styles from "./LessonManager.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface Lesson {
  id: string;
  title: string;
  content: string;
  durationMinutes: number;
  position: number;
  resources: any[];
  quizzes: any[];
  assignments: any[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: Lesson[];
}

interface LessonManagerProps {
  modules: Module[];
  onSave: (modules: Module[]) => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ modules, onSave }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [moduleList, setModuleList] = useState<Module[]>(modules);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{
    lesson: Lesson | null;
    moduleId: string | null;
  }>({
    lesson: null,
    moduleId: null,
  });
  const [form] = Form.useForm();

  // Abrir modal para adicionar uma nova lição
  const showAddModal = (moduleId: string) => {
    form.resetFields();
    setEditingLesson({ lesson: null, moduleId });
    setIsModalVisible(true);
  };

  // Abrir modal para editar uma lição existente
  const showEditModal = (moduleId: string, lesson: Lesson) => {
    form.setFieldsValue({
      ...lesson,
    });
    setEditingLesson({ lesson, moduleId });
    setIsModalVisible(true);
  };

  // Fechar o modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Lidar com a submissão do formulário
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!editingLesson.moduleId) return;

      const updatedModules = [...moduleList];
      const moduleIndex = updatedModules.findIndex(
        (m) => m.id === editingLesson.moduleId
      );

      if (moduleIndex === -1) return;

      if (editingLesson.lesson) {
        // Atualizando uma lição existente
        const lessonIndex = updatedModules[moduleIndex].lessons.findIndex(
          (l) => l.id === editingLesson.lesson?.id
        );

        if (lessonIndex !== -1) {
          updatedModules[moduleIndex].lessons[lessonIndex] = {
            ...updatedModules[moduleIndex].lessons[lessonIndex],
            ...values,
          };
          messageApi.success("Lesson updated successfully");
        }
      } else {
        // Adicionando uma nova lição
        const newLesson: Lesson = {
          id: `lesson-${Date.now()}`,
          ...values,
          position: updatedModules[moduleIndex].lessons.length,
          resources: [],
          quizzes: [],
          assignments: [],
        };
        updatedModules[moduleIndex].lessons.push(newLesson);
        messageApi.success("Lesson added successfully");
      }

      setModuleList(updatedModules);
      onSave(updatedModules);
      setIsModalVisible(false);
    });
  };

  // Excluir uma lição
  const deleteLesson = (moduleId: string, lessonId: string) => {
    modal.confirm({
      title: "Are you sure you want to delete this lesson?",
      content:
        "This action cannot be undone. All content within this lesson will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        const updatedModules = [...moduleList];
        const moduleIndex = updatedModules.findIndex((m) => m.id === moduleId);

        if (moduleIndex !== -1) {
          updatedModules[moduleIndex].lessons = updatedModules[
            moduleIndex
          ].lessons
            .filter((lesson) => lesson.id !== lessonId)
            .map((lesson, index) => ({ ...lesson, position: index }));

          setModuleList(updatedModules);
          onSave(updatedModules);
          messageApi.success("Lesson deleted successfully");
        }
      },
    });
  };

  // Verificar se há módulos para trabalhar
  if (moduleList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Empty
          description="You need to create modules before adding lessons"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className={styles.emptyStateAction}>
          <Button
            type="primary"
            onClick={() =>
              messageApi.info("Please go back to the Modules step")
            }
          >
            Create Modules First
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {messageContextHolder}
      {modalContextHolder}
      <div className={styles.lessonManagerContainer}>
        <div className={styles.managerHeader}>
          <Title level={4}>Lesson Content</Title>
          <Text type="secondary" className={styles.headerDescription}>
            Add lessons to your modules. Each lesson can contain content,
            resources, quizzes, and assignments.
          </Text>
        </div>

        <Collapse
          className={styles.modulesCollapse}
          defaultActiveKey={[moduleList[0]?.id]}
          items={moduleList.map((module, moduleIndex) => ({
            key: module.id,
            label: (
              <div className={styles.moduleHeader}>
                <span className={styles.moduleTitle}>
                  Module {moduleIndex + 1}: {module.title}
                </span>
                <span className={styles.lessonCount}>
                  {module.lessons.length}{" "}
                  {module.lessons.length === 1 ? "lesson" : "lessons"}
                </span>
              </div>
            ),
            children: (
              <>
                {module.lessons.length === 0 ? (
                  <Empty
                    description="No lessons in this module yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className={styles.moduleEmpty}
                  />
                ) : (
                  <div className={styles.lessonsList}>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <Card
                        key={lesson.id}
                        className={styles.lessonCard}
                        title={
                          <div className={styles.lessonCardTitle}>
                            <span className={styles.lessonNumber}>
                              Lesson {lessonIndex + 1}
                            </span>
                            <span>{lesson.title}</span>
                          </div>
                        }
                        extra={
                          <Space>
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => showEditModal(module.id, lesson)}
                              aria-label="Edit lesson"
                            />
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => deleteLesson(module.id, lesson.id)}
                              aria-label="Delete lesson"
                            />
                          </Space>
                        }
                      >
                        <div className={styles.lessonContent}>
                          <Paragraph
                            ellipsis={{
                              rows: 2,
                              expandable: true,
                              symbol: "more",
                            }}
                            className={styles.lessonDescription}
                          >
                            {lesson.content}
                          </Paragraph>
                          <div className={styles.lessonMeta}>
                            <div className={styles.duration}>
                              <Text type="secondary">
                                Duration: {lesson.durationMinutes} min
                              </Text>
                            </div>
                            <div className={styles.resourcesLinks}>
                              <Button
                                type="link"
                                size="small"
                                icon={<FileAddOutlined />}
                                className={styles.resourceLink}
                              >
                                Add Resources
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                <div className={styles.addLessonContainer}>
                  <Button
                    type="dashed"
                    onClick={() => showAddModal(module.id)}
                    icon={<PlusOutlined />}
                    className={styles.addLessonButton}
                  >
                    Add Lesson to this Module
                  </Button>
                </div>
              </>
            ),
          }))}
          expandIconPosition="start"
        />

        {/* Modal para adicionar/editar lição */}
        <Modal
          title={editingLesson.lesson ? "Edit Lesson" : "Add New Lesson"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          okText={editingLesson.lesson ? "Save Changes" : "Add Lesson"}
          width={700}
        >
          <Form form={form} layout="vertical" requiredMark="optional">
            <Form.Item
              name="title"
              label="Lesson Title"
              rules={[
                { required: true, message: "Please enter lesson title" },
                { max: 100, message: "Title must be maximum 100 characters" },
              ]}
            >
              <Input placeholder="e.g. Introduction to Variables" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Lesson Content"
              rules={[
                { required: true, message: "Please enter lesson content" },
              ]}
            >
              <TextArea
                placeholder="Add your lesson content here..."
                rows={6}
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item
              name="durationMinutes"
              label="Estimated Duration (minutes)"
              rules={[
                {
                  required: true,
                  message: "Please enter the estimated duration",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={600}
                placeholder="e.g. 30"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default LessonManager;
